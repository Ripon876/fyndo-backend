const User = require("../models/user");
const Thread = require("../models/thread");
const Message = require("../models/message");

exports.GetThread = async (req, res) => {
  try {
    if (req.query.id) {
      const thred = await Thread.findById(req.query.id)
        .populate("messages")
        .skip(0)
        .limit(2);

      console.log("finding thread using id");
      thred.users.splice(thred.users.indexOf(req.body.userId), 1);
      const user2 = await User.findById(thred.users[0]).select([
        "-password",
        "-contacts",
        "-education",
        "-post",
        "-threads",
      ]);

      res.status(200).json({
        status: true,
        id: thred._id,
        messages: thred.messages.slice(thred.messages.length - 10),
        cw: user2,
      });
      return;
    } else {
      const user2 = await User.findById(req.body.users[1]).select([
        "-password",
        "-contacts",
        "-education",
        "-post",
        "-threads",
      ]);
      const oldThred = await Thread.find({
        users: { $in: [req.body.users] },
      }).populate("messages");

      if (oldThred) {
        res.status(200).json({
          status: true,
          id: id,
          messages: oldThred.messages.slice(oldThred.messages.length - 10),
          cw: user2,
        });
      } else {
        const thred = await Thread.create({
          users: req.body.users,
          messages: [],
        });

        const user1 = await User.findById(req.body.users[0]);
        user1.threads.push(thred._id);
        user1.save();

        user2.threads.push(thred._id);
        user2.save();
        console.log("creating new thread");

        res.status(200).json({
          status: true,
          id: thred._id,
          messages: thred?.messages?.slice(thred.messages.length - 10),
          cw: user2,
        });
      }
    }
  } catch (err) {
    console.log(err);
    res.json({ status: false });
  }
};

exports.GetFriends = async (req, res) => {
  if (req.signedCookies.refreshtoken) {
    const users = await User.find({}).select([
      "-password",
      "-contacts",
      "-education",
      "-post",
      "-threads",
    ]);
    res.json(users);
  } else {
    res.json({});
  }
};
