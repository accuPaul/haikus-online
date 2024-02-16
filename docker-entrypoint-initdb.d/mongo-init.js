print("Started Adding the Users.");
db = db.getSiblingDB("HaikuProject");
db.createUser({
  user: process.env.MONGO_USER,
  pwd: process.env.MONGO_PW,
  roles: [{ role: "readWrite", db: "HaikuProject" }],
});
print("End Adding the User Roles.");