import { ZoomMtg } from "@zoomus/websdk";

const testTool = window.testTool;
const tmpArgs = testTool.parseQuery();
const meetingConfig = {
  apiKey: tmpArgs.apiKey,
  meetingNumber: tmpArgs.mn,
  userName: (() => {
    if (tmpArgs.name) {
      try {
        return testTool.b64DecodeUnicode(tmpArgs.name);
      } catch (e) {
        return tmpArgs.name;
      }
    }
    return (
      "CDN#" +
      tmpArgs.version +
      "#" +
      testTool.detectOS() +
      "#" +
      testTool.getBrowserInfo()
    );
  })(),
  passWord: tmpArgs.pwd,
  leaveUrl: "/index.html",
  role: parseInt(tmpArgs.role, 10),
  userEmail: (() => {
    try {
      return testTool.b64DecodeUnicode(tmpArgs.email);
    } catch (e) {
      return tmpArgs.email;
    }
  })(),
  lang: tmpArgs.lang,
  signature: tmpArgs.signature || "",
  china: tmpArgs.china === "1",
};

ZoomMtg.preLoadWasm();
ZoomMtg.prepareJssdk();

function beginJoin(signature) {
  ZoomMtg.init({
    leaveUrl: meetingConfig.leaveUrl,
    webEndpoint: meetingConfig.webEndpoint,
    success: function () {
      console.log(meetingConfig);
      console.log("signature", signature);
      $.i18n.reload(meetingConfig.lang);
      ZoomMtg.join({
        meetingNumber: meetingConfig.meetingNumber,
        userName: meetingConfig.userName,
        signature: signature,
        apiKey: meetingConfig.apiKey,
        userEmail: meetingConfig.userEmail,
        passWord: meetingConfig.passWord,
        success: function (res) {
          console.log("join meeting success");
          console.log("get attendeelist");
          ZoomMtg.getAttendeeslist({});
          ZoomMtg.getCurrentUser({
            success: function (res) {
              console.log("success getCurrentUser", res.result.currentUser);
            },
          });
        },
        error: function (res) {
          console.log(res);
        },
      });
    },
    error: function (res) {
      console.log(res);
    },
  });

  ZoomMtg.inMeetingServiceListener('onUserJoin', (data) => {
    console.log('inMeetingServiceListener onUserJoin', data);
  });

  ZoomMtg.inMeetingServiceListener('onUserLeave', (data) => {
    console.log('inMeetingServiceListener onUserLeave', data);
  });

  ZoomMtg.inMeetingServiceListener('onUserIsInWaitingRoom', (data) => {
    console.log('inMeetingServiceListener onUserIsInWaitingRoom', data);
  });

  ZoomMtg.inMeetingServiceListener('onMeetingStatus', (data) => {
    console.log('inMeetingServiceListener onMeetingStatus', data);
  });
}

beginJoin(meetingConfig.signature);
