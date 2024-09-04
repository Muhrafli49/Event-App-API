const Participant = require('../../api/v1/participants/model');
const Events = require('../../api/v1/events/model');
const Orders = require('../../api/v1/orders/model');
const { otpMail, orderMail  } = require('../mail');
const { NotFoundError, BadRequestError, UnauthorizedError } = require('../../errors');
const { createTokenParticipant, createJWT } = require('../../utils');
const Payments = require('../../api/v1/payments/model');

const signupParticipant = async (req) => {
    const { firstName, lastName, email, password, role } = req.body;

    let result = await Participant.findOne({
        email,
        status: 'Non-Active'
    });

    if (result) {
        result.firstName = firstName;
        result.lastName = lastName;
        result.role = role;
        result.email = email,
        result.password = password;
        result.otp = Math.floor(Math.random() * 9999);
        await result.save();

    } else {
        result = await Participant.create({
            firstName,
            lastName,
            email,
            password,
            role,
            otp: Math.floor(Math.random() * 9999),
        });
    }
    await otpMail(email, result);

    delete result._doc.password;
    delete result._doc.otp;

    return result;
};

const activateParticipant = async (req) => {
    const { otp, email } = req.body;
    const check = await Participant.findOne({
        email,
    });

    if (!check) throw new NotFoundError('Participants not registered yet');

    if (check && check.otp !== otp) throw new BadRequestError('Code otp is wrong')

    const result = await Participant.findByIdAndUpdate(check._id, {
        status: 'Active'
    },
    { new: true }
);

    delete result._doc.password;


    return result;
};


const signinParticipant = async (req) => {
    const { email, password } = req.body;

    if (!email || !password) {
        throw new BadRequestError('Please provide email and password');
    }

    const result = await Participant.findOne({ email: email });

    if (!result) {
        throw new NotFoundError('Participants not registered yet');
    }

    if (result.status === 'Non-Active') {
        throw new UnauthorizedError('Your account is not active');
    }

    const isPasswordCorrect = await result.comparePassword(password);


    if (!isPasswordCorrect) {
        throw new UnauthorizedError('Invalid credentials');
    }

    const token = createJWT({ payload: createTokenParticipant(result) });

    return token;
};

const getAllEvents = async (req) => {
    const result = await Events.find({ statusEvent: 'Published' })
        .populate('category')
        .populate('image')
        .select('_id title date tickets venueName');

    return result;
};

const getOneEvent = async (req) => {
    const { id } = req.params;
    const result = await Events.findOne({ _id: id })
        .populate('category')
        .populate({ path: 'talent', populate: 'image' })
        .populate('image');

    if (!result) throw new NotFoundError(`Tidak ada acara dengan id :  ${id}`);

    return result;
};

const getAllOrders = async (req) => {
    if (!req.participant || !req.participant.id) {
        throw new Error('Participant not authenticated');
    }
    
    const result = await Orders.find({ participant: req.participant.id });
    return result;
};

const checkoutOrder = async (req) => {
    const { event, personalDetail, payment, tickets } = req.body;

    const checkingEvent = await Events.findOne({ _id: event });
    if (!checkingEvent) {
        throw new NotFoundError(`Event not found with id ${event}`);
    }

    const checkingPayment = await Payments.findOne({ _id: payment });
    if (!checkingPayment) {
        throw new NotFoundError(`There is no payment method with id: ${payment}`);
    }

    let totalPay = 0;
    let totalOrderTicket = 0;

    // Proses tiket
    for (const tic of tickets) {
        const eventTicket = checkingEvent.tickets.find(ticket => tic.ticketCategories.type === ticket.type);

        if (!eventTicket) {
            throw new NotFoundError(`Ticket type ${tic.ticketCategories.type} not found`);
        }

        if (tic.sumTicket > eventTicket.stock) {
            throw new NotFoundError('Stock event tidak mencukupi');
        } else {
            eventTicket.stock -= tic.sumTicket;
            totalOrderTicket += tic.sumTicket;
            totalPay += tic.ticketCategories.price * tic.sumTicket;
        }
    }

    // Simpan perubahan acara
    await checkingEvent.save();

    // Data acara untuk histori
    const historyEvent = {
        title: checkingEvent.title,
        date: checkingEvent.date,
        about: checkingEvent.about,
        tagline: checkingEvent.tagline,
        keyPoint: checkingEvent.keyPoint,
        venueName: checkingEvent.venueName,
        tickets: tickets,
        image: checkingEvent.image,
        category: checkingEvent.category,
        talent: checkingEvent.talent,
        organizer: checkingEvent.organizer,
    };

    // Buat pesanan baru
    const result = new Orders({
        date: new Date(),
        personalDetail: personalDetail,
        totalPay,
        totalOrderTicket,
        orderItems: tickets,
        participant: req.participant.id,
        event,
        historyEvent,
        payment,
    });

    // Simpan pesanan
    await result.save();

    // Kirim email konfirmasi pesanan
    await orderMail(req.participant.email, {
        orderId: result._id,
        totalPay,
        totalOrderTicket,
        orderItems: tickets,
        personalDetail: personalDetail,
        historyEvent: historyEvent
    });

    return result;
};


module.exports = {
    signupParticipant,
    activateParticipant,
    signinParticipant,
    getAllEvents,
    getOneEvent,
    getAllOrders,
    checkoutOrder,
}