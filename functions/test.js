export default (req, res) => {
  res.status(200).send({ data: `Hello ${req.query.name}!` });
};
