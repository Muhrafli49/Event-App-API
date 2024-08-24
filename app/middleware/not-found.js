const notFound = (req, res) => {
    res.status(404).send({ message: "Route is not found" });
};

module.exports = notFound;