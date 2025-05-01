/* 
 * Click nbfs://nbhost/SystemFileSystem/Templates/Licenses/license-default.txt to change this license
 * Click nbfs://nbhost/SystemFileSystem/Templates/ClientSide/javascript.js to edit this template
 */
var jpdbBaseURL = 'http://api.login2explore.com:5577/';
var jpdbIRL = '/api/irl';
var jpdbIML = '/api/iml';
var stdDBName = 'SCHOOL-DB';
var stdRelationName = 'STUDENT-TABLE';
var connToken = '90934705|-31949208569506791|90956241';

$("#stdId").focus();  // Fix: was lowercase "stdid"

function saveRecNo2LS(jsonObj) {
    var lvData = JSON.parse(jsonObj.data);
    localStorage.setItem("recno", lvData.rec_no);
}

function getStdIdAsJsonObj() {
    var stdid = $("#stdId").val();  // Fix: match actual input ID
    var jsonStr = {
        id: stdid
    };
    return JSON.stringify(jsonStr);
}

function getEmp() {
    var stdIdJsonObj = getStdIdAsJsonObj();  // Fix: function name typo
    var getRequest = createGET_BY_KEYRequest(connToken, stdDBName, stdRelationName, stdIdJsonObj);
    
    jQuery.ajaxSetup({ async: false });
    var resJsonObj = executeCommandAtGivenBaseUrl(getRequest, jpdbBaseURL, jpdbIRL); // Fix: missing execution
    jQuery.ajaxSetup({ async: true });

    if (resJsonObj.status === 400) {
        $("#save").prop("disabled", false);
        $("#reset").prop("disabled", false);
        $("#stdName").focus();
    } else if (resJsonObj.status === 200) {
        $("#stdId").prop("disabled", true);
        fillData(resJsonObj);
        $("#update").prop("disabled", false);
        $("#reset").prop("disabled", false);
        $("#stdName").focus();
    }
}

function fillData(jsonObj) {
    saveRecNo2LS(jsonObj);
    var record = JSON.parse(jsonObj.data).record;
    $("#stdName").val(record.name);
    $("#stdClass").val(record.class);
    $("#stddate").val(record.birth);
    $("#stdadd").val(record.address);
    $("#stdenroll").val(record.enroll);
}

function resetForm() {
    $("#stdId").val("");
    $("#stdName").val("");
    $("#stdClass").val("");
    $("#stddate").val("");
    $("#stdadd").val("");
    $("#stdenroll").val("");
    $("#stdId").prop("disabled", false);
    $("#save").prop("disabled", true);
    $("#update").prop("disabled", true);
    $("#reset").prop("disabled", true);
    $("#stdId").focus();
}

function saveData() {
    var jsonStrObj = validateData();
    if (jsonStrObj === "") return;

    var putRequest = createPUTRequest(connToken, jsonStrObj, stdDBName, stdRelationName);
    jQuery.ajaxSetup({ async: false });
    var resJsonObj = executeCommandAtGivenBaseUrl(putRequest, jpdbBaseURL, jpdbIML);
    jQuery.ajaxSetup({ async: true });
    resetForm();
    $("#stdId").focus();
}

function updateData() {
    $("#update").prop("disabled", true);
    var jsonChg = validateData();
    var updateRequest = createUPDATERecordRequest(connToken, jsonChg, stdDBName, stdRelationName, localStorage.getItem("recno"));
    jQuery.ajaxSetup({ async: false });
    var resJsonObj = executeCommandAtGivenBaseUrl(updateRequest, jpdbBaseURL, jpdbIML);
    jQuery.ajaxSetup({ async: true });
    console.log(resJsonObj);
    resetForm();
    $("#stdId").focus();
}

function validateData() {
    var stdid = $("#stdId").val();
    var stdname = $("#stdName").val();
    var stdclass = $("#stdClass").val();
    var stddate = $("#stddate").val();
    var stdadd = $("#stdadd").val();
    var stdenroll = $("#stdenroll").val();

    if (stdid === "") {
        alert("Student Roll no. missing");
        $("#stdId").focus();
        return "";
    }
    if (stdname === "") {
        alert("Student Name missing");
        $("#stdName").focus();
        return "";
    }
    if (stdclass === "") {
        alert("Class missing");
        $("#stdClass").focus();
        return "";
    }
    if (stddate === "") {
        alert("Date of Birth missing");
        $("#stddate").focus();
        return "";
    }
    if (stdadd === "") {
        alert("Address missing");
        $("#stdadd").focus();
        return "";
    }
    if (stdenroll === "") {
        alert("Enrollment Date missing");
        $("#stdenroll").focus();
        return "";
    }

    var jsonStrObj = {
        id: stdid,
        name: stdname,
        class: stdclass,
        birth: stddate,
        address: stdadd,
        enroll: stdenroll
    };
    return JSON.stringify(jsonStrObj);
}
