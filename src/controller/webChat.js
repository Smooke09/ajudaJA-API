const { firebaseApp } = require("../config/dbconnectionFirebase");
const { timeFormat, dayFormat } = require("../helpers/newDate");

exports.getMsgClient = () => async (req, res) => {
  /*
            #swagger.tags = ['Public / WebChat']
            #swagger.security = [{
            "bearerAuth": []
          },
        ]
     */

  const section = req.params.id;
  console.log(section);

  let date = dayFormat(new Date()).replace(/\//g, "_");

  const dataNew = [];
  const msgClient = firebaseApp.database().ref(section).child(date);

  try {
    const snapshot = await msgClient.on("value", (snapshot) => {
      snapshot?.forEach((childSnapshot) => {
        const data = childSnapshot.val();
        dataNew.push(data);
      });
      return res.status(200).json(dataNew);
    });
  } catch (error) {
    console.log(error);
  }
};
