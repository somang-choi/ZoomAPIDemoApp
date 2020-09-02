import { ZoomMtg } from "@zoomus/websdk";

ZoomMtg.preLoadWasm();
ZoomMtg.prepareJssdk();

const API_KEY = process.env.API_KEY;
const API_SECRET = process.env.API_SECRET;

testTool = window.testTool;

let meetingNumberBox = document.getElementById("meeting_number");
let meetingPwBox = document.getElementById("meeting_pwd");
let meetingLangBox = document.getElementById("meeting_lang");

function getCookies() {
  meetingNumberBox.value = testTool.getCookie("meeting_number");
  meetingPwBox.value = testTool.getCookie("meeting_pwd");
  
  if (testTool.getCookie("meeting_lang")) meetingLangBox.value = testTool.getCookie("meeting_lang");
}

function onChangeLang(e) {
  testTool.setCookie("meeting_lang", meetingLangBox.value);
  $.i18n.reload(meetingLangBox.value);
  ZoomMtg.reRender({ lang: meetingLangBox.value });
}

function onInputMeetingNumber(e) {
  let tmpMn = e.target.value.replace(/([^0-9])+/i, "");
  if (tmpMn.match(/([0-9]{9,11})/)) tmpMn = tmpMn.match(/([0-9]{9,11})/)[1];

  let tmpPwd = e.target.value.match(/pwd=([\d,\w]+)/);
  if (tmpPwd) {
    meetingPwBox.value = tmpPwd[1];
    testTool.setCookie("meeting_pwd", tmpPwd[1]);
  }
  meetingNumber.value = tmpMn;
  testTool.setCookie("meeting_number", meetingNumber.value);
}

function onClickClearAll(e) {
  testTool.deleteAllCookies();
  document.getElementById("display_name").value = "";
  meetingNumberBox.value = "";
  meetingPwBox.value = "";
  meetingLangBox.value = "ko-KO";
  document.getElementById("meeting_role").value = 1;
  window.location.href = "/index.html";
}

function onClickJoinMeeting(e) {
  e.preventDefault();

  const meetingConfig = testTool.getMeetingConfig();
  if (!meetingConfig.mn || !meetingConfig.name) {
    alert("Meeting number or username is empty");
    return false;
  }
  
  testTool.setCookie("meeting_number", meetingConfig.mn);
  testTool.setCookie("meeting_pwd", meetingConfig.pwd);

  const signature = ZoomMtg.generateSignature({
    meetingNumber: meetingConfig.mn,
    apiKey: API_KEY,
    apiSecret: API_SECRET,
    role: meetingConfig.role,
    success: function (res) {
      console.log(res.result);
      meetingConfig.signature = res.result;
      meetingConfig.apiKey = API_KEY;
      const joinUrl = "/meeting.html?" + testTool.serialize(meetingConfig);
      console.log(joinUrl);
      window.open(joinUrl, "_blank");
    },
  });
}

function onClickJoinIFrameBtn(e) {
  e.preventDefault();

  const meetingConfig = testTool.getMeetingConfig();
  if (!meetingConfig.mn || !meetingConfig.name) {
    alert("Meeting number or username is empty");
    return false;
  }

  const signature = ZoomMtg.generateSignature({
    meetingNumber: meetingConfig.mn,
    apiKey: API_KEY,
    apiSecret: API_SECRET,
    role: meetingConfig.role,
    success: function (res) {
      console.log(res.result);
      meetingConfig.signature = res.result;
      meetingConfig.apiKey = API_KEY;
      const joinUrl = testTool.getCurrentDomain() + "/meeting.html?" + testTool.serialize(meetingConfig);
      testTool.createZoomNode("websdk-iframe", joinUrl);
    },
  });
}

function onClickCreateMeetingBtn(e) {
  window.open('http://localhost:4000');
}

function addEvent() {
  document.getElementById("create_meeting").addEventListener("click", onClickCreateMeetingBtn(e));
  document.getElementById("join_iframe").addEventListener("click", onClickJoinIFrameBtn(e));
  document.getElementById("join_meeting").addEventListener("click", onClickJoinMeeting(e));
  document.getElementById("clear_all").addEventListener("click", onClickClearAll(e));
  meetingNumberBox.addEventListener("input", onInputMeetingNumber(e));
  meetingLangBox.addEventListener("change", onChangeLang(e));
}

function init() {
  getCookies();
  addEvent();
}

init();