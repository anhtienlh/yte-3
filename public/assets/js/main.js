var listExportDataNormal = [];
var listExportDataAbnormal = [];
var listExportDataRecall = [];
var listExportDataSymmetric = [];
var listExportDataNonSymmetric = [];
let excelRowsRawData = [];
let excelRowsDapAn = [];
let excelRowsUser = [];
let tableRowData;
let isInitTableRowData = false;
let tableAnswerData;
let isInitTableAnswerData = false;
let tableUserData;
let isInitTableUserData = false;
var listFrame = [];
var listFrameJRSymmetric = [];
var listFrameJRNonSymmetric = [];
var listFrameFR = [];
var listExportN1toN5_R = [];
var listExportN1toN5_JRDX = [];
var listExportN1toN5_JRKDX = [];
var listExportN1toN5_FR = [];
var exportRow = {
    testId: "",
    userId: "",
    others: {
        listCaseIdTrue: [],
        listCaseIdFalse: [""],
        percentType: "",
        numberCaseTrue: 0,
        totalCase: 0,
        listAge: "",
    },
};
var listCaseIdbyTestId = [];
var listR = [];
var listJRSymmetric = [];
var listJRNonSymmetric = [];
var listFR = [];

var objDapAnSymmetricTrue = [];
var objDapAnSymmetricFalse = [];
var objDapAnNonSymmetricTrue = [];
var objDapAnNonSymmetricFalse = [];
var countTTTTT = 0;

let header = [];

const headerVairable = [
    "test_id",
    "user_id",
    "session_no",
    "case_id",
    "rating",
    "selectX",
    "selectY",
    "truthX",
    "truthY",
    "lesionID",
    "frame",
    "slice",
    "distance",
    "timedate",
    "Case density (user)",
    "Lesion type(User)",
];

let headerUser = [];

let headerAnswer = [];

let userFilter = [];
let answerFilter = [];
let result = [];
let dropdownArrayValue = [];
let dropdownObject = {};
let caseDensityArrayValue = [];
let lessionTypeArrayValue = [];
let tagConfig;
let rateConfig;
let countDensity = 0;
let countDensityRJRFR = 0;
let countLesionR = 0;

var tab_1 = [],
    tab_2 = [],
    tab_3 = [],
    tab_4 = [],
    tab_5 = [];
var tab_6 = [],
    tab_7 = [],
    tab_8 = [],
    tab_9 = [];

$("#tagSelect").change(function() {
    tagConfig = $(this).children("option:selected").val();
});

$("#rateSelect").change(function() {
    rateConfig = $(this).children("option:selected").val();
});

$("#caseDensityCustomSelect").change(function() {
    caseDensityArrayValue = $(this).selectpicker("val");
});

$("#lessionTypeCustomSelect").change(function() {
    lessionTypeArrayValue = $(this).selectpicker("val");
});

$("#inlineFormCustomSelect").change(function() {
    dropdownArrayValue = $(this).selectpicker("val");
    dropdownObject = {};
    for (var i = 0; i < dropdownArrayValue.length; i++) {
        var val = dropdownArrayValue[i];
        var txt = $("#inlineFormCustomSelect option[value='" + val + "']").text();

        dropdownObject[val] = txt;
    }
});

$(".custom-file-input").on("change", function() {
    var fileName = $(this).val().split("\\").pop();
    $(this).siblings(".custom-file-label").addClass("selected").html(fileName);
});

$("#btnApply").css("visibility", "visible");

function getResult() {
    // $('body').addClass('loading');

    resetData();
    $("#btnExport").css("visibility", "visible");
    window.location.href = "#resultFilter";

    if (userFilter.length === 0 || userFilter.length === excelRowsUser.length) {
        userFilter = Array.from(excelRowsUser);
    }

    if (
        answerFilter.length === 0 ||
        answerFilter.length === excelRowsDapAn.length
    ) {
        answerFilter = Array.from(excelRowsDapAn);
    }

    let resultAfterFilterUserTable = [];

    excelRowsRawData.forEach((value) => {
        userFilter.forEach((val) => {
            if (
                val[headerUser[0]] == value[header[0]] &&
                val[headerUser[2]] == value[header[2]] &&
                val[headerUser[1]] == value[header[1]]
            ) {
                if (!resultAfterFilterUserTable.includes(value)) {
                    resultAfterFilterUserTable.push(value);
                }
            }
        });
    });

    let resultAfterFilterAnwerFilter = [];
    resultAfterFilterUserTable.forEach((value) => {
        answerFilter.forEach((val) => {
            if (
                value[header[0]] == val[headerAnswer[0]] &&
                value[header[3]] == val[headerAnswer[1]]
            ) {
                if (!resultAfterFilterAnwerFilter.includes(value)) {
                    resultAfterFilterAnwerFilter.push(value);
                }
            }
        });
    });

    let tmp2 = [];

    if (isInitTableRowData) {
        tmp2 = convertLstObjectToArray(resultAfterFilterAnwerFilter);
        tableRowData.clear().rows.add(tmp2).draw();
    } else {
        initRawDataTable(resultAfterFilterAnwerFilter);
    }

    let dataFill = tableRowData.context[0].aoData;
    result = convertArrayTolstObject(dataFill);

    let answerFilterClone = [];
    for (let x = 0; x < answerFilter.length; x++) {
        let count = 0;
        userFilter.forEach((element) => {
            if (element["test_id"] === answerFilter[x]["Test set"]) {
                count = 1;
            }
        });
        if (count > 0) {
            answerFilter[x]["Lesion ID"] += "";
            answerFilter[x]["Case density"] += "";
            answerFilter[x]["Case ID"] += "";
            answerFilter[x]["Test set"] += "";
            answerFilter[x]["TruthX"] += "";
            answerFilter[x]["TruthY"] += "";
            answerFilterClone.push(answerFilter[x]);
        }
    }
    // answerFilter = answerFilterClone;

    let a = result.slice();
    let b = answerFilterClone.slice();
    // coreCalculate(result.slice(), answerFilterClone.slice());
    console.log("A", a);
    console.log("B", b);
    coreCalculate(a, b);
}

function filterBy(arr, headerType, value, pos) {
    let data = [];
    arr.forEach((val) => {
        if (value.includes("" + val[headerType[pos]])) {
            data.push(val);
        }
    });
    return data;
}

function resetData() {
    listExportDataNormal = [];
    listExportDataAbnormal = [];
    listExportDataRecall = [];
    listExportDataSymmetric = [];
    listExportDataNonSymmetric = [];
    listCaseIdbyTestId = [];
    listR = [];
    listJRSymmetric = [];
    listJRNonSymmetric = [];
    listFR = [];
    listFrame = [];
    listFrameJRSymmetric = [];
    listFrameJRNonSymmetric = [];
    listFrameFR = [];

    listExportN1toN5_R = [];
    listExportN1toN5_JRDX = [];
    listExportN1toN5_JRKDX = [];
    listExportN1toN5_FR = [];
}

function initRawDataTable(excelRowsRawData) {
    isInitTableRowData = true;
    $("#rowdata-table").css("visibility", "visible");
    let dataSet = convertLstObjectToArray(excelRowsRawData);
    tableRowData = $("#tblRowData").DataTable({
        paginate: false,
        retrieve: true,
        ordering: true,
        scrollX: true,
        scrollY: "500px",
        searching: true,
        data: dataSet,
        columns: [{
                title: '<div style="display: flex;">' +
                    header[0] +
                    '<img src="http://www.icone-png.com/png/39/38556.png" class="filterIcon" onclick="showFilter(event,\'' +
                    "tblRowData" +
                    "_" +
                    0 +
                    "')\" /></div>",
            },
            {
                title: '<div style="display: flex;">' +
                    header[1] +
                    '<img src="http://www.icone-png.com/png/39/38556.png" class="filterIcon" onclick="showFilter(event,\'' +
                    "tblRowData" +
                    "_" +
                    1 +
                    "')\" /></div>",
            },
            {
                title: '<div style="display: flex;">' +
                    header[2] +
                    '<img src="http://www.icone-png.com/png/39/38556.png" class="filterIcon" onclick="showFilter(event,\'' +
                    "tblRowData" +
                    "_" +
                    2 +
                    "')\" /></div>",
            },
            {
                title: '<div style="display: flex;">' +
                    header[3] +
                    '<img src="http://www.icone-png.com/png/39/38556.png" class="filterIcon" onclick="showFilter(event,\'' +
                    "tblRowData" +
                    "_" +
                    3 +
                    "')\" /></div>",
            },
            {
                title: '<div style="display: flex;">' +
                    header[4] +
                    '<img src="http://www.icone-png.com/png/39/38556.png" class="filterIcon" onclick="showFilter(event,\'' +
                    "tblRowData" +
                    "_" +
                    4 +
                    "')\" /></div>",
            },
            {
                title: '<div style="display: flex;">' +
                    header[5] +
                    '<img src="http://www.icone-png.com/png/39/38556.png" class="filterIcon" onclick="showFilter(event,\'' +
                    "tblRowData" +
                    "_" +
                    5 +
                    "')\" /></div>",
            },
            {
                title: '<div style="display: flex;">' +
                    header[6] +
                    '<img src="http://www.icone-png.com/png/39/38556.png" class="filterIcon" onclick="showFilter(event,\'' +
                    "tblRowData" +
                    "_" +
                    6 +
                    "')\" /></div>",
            },
            {
                title: '<div style="display: flex;">' +
                    header[7] +
                    '<img src="http://www.icone-png.com/png/39/38556.png" class="filterIcon" onclick="showFilter(event,\'' +
                    "tblRowData" +
                    "_" +
                    7 +
                    "')\" /></div>",
            },
            {
                title: '<div style="display: flex;">' +
                    header[8] +
                    '<img src="http://www.icone-png.com/png/39/38556.png" class="filterIcon" onclick="showFilter(event,\'' +
                    "tblRowData" +
                    "_" +
                    8 +
                    "')\" /></div>",
            },
            {
                title: '<div style="display: flex;">' +
                    header[9] +
                    '<img src="http://www.icone-png.com/png/39/38556.png" class="filterIcon" onclick="showFilter(event,\'' +
                    "tblRowData" +
                    "_" +
                    9 +
                    "')\" /></div>",
            },
            {
                title: '<div style="display: flex;">' +
                    header[10] +
                    '<img src="http://www.icone-png.com/png/39/38556.png" class="filterIcon" onclick="showFilter(event,\'' +
                    "tblRowData" +
                    "_" +
                    10 +
                    "')\" /></div>",
            },
            {
                title: '<div style="display: flex;">' +
                    header[11] +
                    '<img src="http://www.icone-png.com/png/39/38556.png" class="filterIcon" onclick="showFilter(event,\'' +
                    "tblRowData" +
                    "_" +
                    11 +
                    "')\" /></div>",
            },
            {
                title: '<div style="display: flex;">' +
                    header[12] +
                    '<img src="http://www.icone-png.com/png/39/38556.png" class="filterIcon" onclick="showFilter(event,\'' +
                    "tblRowData" +
                    "_" +
                    12 +
                    "')\" /></div>",
            },
            {
                title: '<div style="display: flex;">' +
                    header[13] +
                    '<img src="http://www.icone-png.com/png/39/38556.png" class="filterIcon" onclick="showFilter(event,\'' +
                    "tblRowData" +
                    "_" +
                    13 +
                    "')\" /></div>",
            },
            {
                title: '<div style="display: flex;" class="checkbox"><input type="checkbox" id="cbCaseDensity" onclick="onClick(event, \'cbCaseDensity\')"  />' +
                    header[14] +
                    '<img src="http://www.icone-png.com/png/39/38556.png" class="filterIcon" onclick="showFilter(event,\'' +
                    "tblRowData" +
                    "_" +
                    14 +
                    "')\" /></div>",
            },
            {
                title: '<div style="display: flex;" class="checkbox"><input type="checkbox" id="cbLessionType"  onclick="onClick(event, \'cbLessionType\')"  />' +
                    header[15] +
                    '<img src="http://www.icone-png.com/png/39/38556.png" class="filterIcon" onclick="showFilter(event,\'' +
                    "tblRowData" +
                    "_" +
                    15 +
                    "')\" /></div>",
            },
        ],
        initComplete: function() {
            configFilter(
                this.api().columns(),
                "tblRowData", [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15], [13, 7, 8, 5, 6]
            );
        },
    });
}

let tblUser;

function initTableUser(excelUserData) {
    let searchPos = [];
    isInitTableUserData = true;
    $("#user-table").css("visibility", "visible");
    $("#tblUserData tfoot th").css("visibility", "visible");
    let dataSet = convertlstUserToArray(excelUserData);
    tableUserData = $("#tblUserData").DataTable({
        paginate: false,
        retrieve: true,
        scrollX: true,
        scrollY: "500px",
        ordering: true,
        searching: true,
        data: dataSet,
        columns: [{
                title: '<div style="display: flex;">' +
                    headerUser[0] +
                    '<img src="http://www.icone-png.com/png/39/38556.png" class="filterIcon" onclick="showFilter(event,\'' +
                    "tblUserData" +
                    "_" +
                    0 +
                    "')\" /></div>",
            },
            {
                title: '<div style="display: flex;">' +
                    headerUser[1] +
                    '<img src="http://www.icone-png.com/png/39/38556.png" class="filterIcon" onclick="showFilter(event,\'' +
                    "tblUserData" +
                    "_" +
                    1 +
                    "')\" /></div>",
            },
            {
                title: '<div style="display: flex;">' +
                    headerUser[2] +
                    '<img src="http://www.icone-png.com/png/39/38556.png" class="filterIcon" onclick="showFilter(event,\'' +
                    "tblUserData" +
                    "_" +
                    2 +
                    "')\" /></div>",
            },
            {
                title: '<div style="display: flex;">' +
                    headerUser[3] +
                    '<img src="http://www.icone-png.com/png/39/38556.png" class="filterIcon" onclick="showFilter(event,\'' +
                    "tblUserData" +
                    "_" +
                    3 +
                    "')\" /></div>",
            },
            {
                title: '<div style="display: flex;">' +
                    headerUser[4] +
                    '<img src="http://www.icone-png.com/png/39/38556.png" class="filterIcon" onclick="showFilter(event,\'' +
                    "tblUserData" +
                    "_" +
                    4 +
                    "')\" /></div>",
            },
            {
                title: '<div style="display: flex;">' +
                    headerUser[5] +
                    '<img src="http://www.icone-png.com/png/39/38556.png" class="filterIcon" onclick="showFilter(event,\'' +
                    "tblUserData" +
                    "_" +
                    5 +
                    "')\" /></div>",
            },
            {
                title: '<div style="display: flex;">' +
                    headerUser[6] +
                    '<img src="http://www.icone-png.com/png/39/38556.png" class="filterIcon" onclick="showFilter(event,\'' +
                    "tblUserData" +
                    "_" +
                    6 +
                    "')\" /></div>",
            },
            {
                title: '<div style="display: flex;">' +
                    headerUser[7] +
                    '<img src="http://www.icone-png.com/png/39/38556.png" class="filterIcon" onclick="showFilter(event,\'' +
                    "tblUserData" +
                    "_" +
                    7 +
                    "')\" /></div>",
            },
        ],
        initComplete: function() {
            tblUser = this;
            configFilter(
                this.api().columns(),
                "tblUserData", [0, 1, 2, 3, 4, 5, 6, 7], [3]
            );
        },
    });
}

let tblAnswer;

function initTableAnswer(excelAnswerData) {
    isInitTableAnswerData = true;
    $("#answer-table").css("visibility", "visible");
    let dataSet = convertlstAnswer(excelAnswerData);
    tableAnswerData = $("#tblAnswerData").DataTable({
        paginate: false,
        retrieve: true,
        scrollX: true,
        scrollY: "500px",
        ordering: true,
        searching: true,
        data: dataSet,
        columns: [{
                title: '<div style="display: flex;">' +
                    headerAnswer[0] +
                    '<img src="http://www.icone-png.com/png/39/38556.png" class="filterIcon" onclick="showFilter(event,\'' +
                    "tblAnswerData" +
                    "_" +
                    0 +
                    "')\" /></div>",
            },
            {
                title: '<div style="display: flex;">' +
                    headerAnswer[1] +
                    '<img src="http://www.icone-png.com/png/39/38556.png" class="filterIcon" onclick="showFilter(event,\'' +
                    "tblAnswerData" +
                    "_" +
                    1 +
                    "')\" /></div>",
            },
            {
                title: '<div style="display: flex;">' +
                    headerAnswer[2] +
                    '<img src="http://www.icone-png.com/png/39/38556.png" class="filterIcon" onclick="showFilter(event,\'' +
                    "tblAnswerData" +
                    "_" +
                    2 +
                    "')\" /></div>",
            },
            {
                title: '<div style="display: flex;">' +
                    headerAnswer[3] +
                    '<img src="http://www.icone-png.com/png/39/38556.png" class="filterIcon" onclick="showFilter(event,\'' +
                    "tblAnswerData" +
                    "_" +
                    3 +
                    "')\" /></div>",
            },
            {
                title: '<div style="display: flex;">' +
                    headerAnswer[4] +
                    '<img src="http://www.icone-png.com/png/39/38556.png" class="filterIcon" onclick="showFilter(event,\'' +
                    "tblAnswerData" +
                    "_" +
                    4 +
                    "')\" /></div>",
            },
            {
                title: '<div style="display: flex;">' +
                    headerAnswer[5] +
                    '<img src="http://www.icone-png.com/png/39/38556.png" class="filterIcon" onclick="showFilter(event,\'' +
                    "tblAnswerData" +
                    "_" +
                    5 +
                    "')\" /></div>",
            },
            {
                title: '<div style="display: flex;">' +
                    headerAnswer[6] +
                    '<img src="http://www.icone-png.com/png/39/38556.png" class="filterIcon" onclick="showFilter(event,\'' +
                    "tblAnswerData" +
                    "_" +
                    6 +
                    "')\" /></div>",
            },
            {
                title: '<div style="display: flex;">' +
                    headerAnswer[7] +
                    '<img src="http://www.icone-png.com/png/39/38556.png" class="filterIcon" onclick="showFilter(event,\'' +
                    "tblAnswerData" +
                    "_" +
                    7 +
                    "')\" /></div>",
            },
            {
                title: '<div style="display: flex;">' +
                    headerAnswer[8] +
                    '<img src="http://www.icone-png.com/png/39/38556.png" class="filterIcon" onclick="showFilter(event,\'' +
                    "tblAnswerData" +
                    "_" +
                    8 +
                    "')\" /></div>",
            },
            {
                title: '<div style="display: flex;">' +
                    headerAnswer[9] +
                    '<img src="http://www.icone-png.com/png/39/38556.png" class="filterIcon" onclick="showFilter(event,\'' +
                    "tblAnswerData" +
                    "_" +
                    9 +
                    "')\" /></div>",
            },
            {
                title: '<div style="display: flex;">' +
                    headerAnswer[10] +
                    '<img src="http://www.icone-png.com/png/39/38556.png" class="filterIcon" onclick="showFilter(event,\'' +
                    "tblAnswerData" +
                    "_" +
                    10 +
                    "')\" /></div>",
            },
            {
                title: '<div style="display: flex;">' +
                    headerAnswer[11] +
                    '<img src="http://www.icone-png.com/png/39/38556.png" class="filterIcon" onclick="showFilter(event,\'' +
                    "tblAnswerData" +
                    "_" +
                    11 +
                    "')\" /></div>",
            },
            {
                title: '<div style="display: flex;">' +
                    headerAnswer[12] +
                    '<img src="http://www.icone-png.com/png/39/38556.png" class="filterIcon" onclick="showFilter(event,\'' +
                    "tblAnswerData" +
                    "_" +
                    12 +
                    "')\" /></div>",
            },
            {
                title: '<div style="display: flex;">' +
                    headerAnswer[13] +
                    '<img src="http://www.icone-png.com/png/39/38556.png" class="filterIcon" onclick="showFilter(event,\'' +
                    "tblAnswerData" +
                    "_" +
                    13 +
                    "')\" /></div>",
            },
            {
                title: '<div style="display: flex;">' +
                    headerAnswer[14] +
                    '<img src="http://www.icone-png.com/png/39/38556.png" class="filterIcon" onclick="showFilter(event,\'' +
                    "tblAnswerData" +
                    "_" +
                    14 +
                    "')\" /></div>",
            },
        ],
        initComplete: function() {
            tblAnswer = this;
            configFilter(
                this.api().columns(),
                "tblAnswerData", [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14], [8, 14, 4, 5]
            );
        },
    });
}

let isCaseDensity = false;
let isLessionType = false;

function onClick(event, value) {
    event.stopPropagation();
    let ele = event.target;
    if (event.target.checked) {
        if (value === "cbCaseDensity") {
            isCaseDensity = true;
        }
        if (value === "cbLessionType") {
            isLessionType = true;
        }
    } else {
        if (value === "cbCaseDensity") {
            isCaseDensity = false;
        }
        if (value === "cbLessionType") {
            isLessionType = false;
        }
    }
}

let userDateNull = false;
let rawDataDateNull = false;

function checkDateNull(event, value) {
    if (value === "tblUserData") {
        userDateNull = true;
    } else {
        rawDataDateNull = true;
    }
}

function configFilter(columns, tableName, colArray, specCol) {
    setTimeout(function() {
        var template =
            '<div class="modalFilter">' +
            '<div class="modal-content1">' +
            "{0}</div>" +
            '<div class="modal-footer row" style="background: none; margin: auto;">' +
            '<a href="#!" onclick="clearFilter(this, {1}, \'{2}\');" >Clear</a>' +
            '<a href="#!" onclick="performFilter(this, {1}, \'{2}\');">Ok</a>' +
            "</div>" +
            "</div>";
        $.each(colArray, function(index, value) {
            columns.every(function(i) {
                var columnName = $(this.header()).text().replace(/\s+/g, "_");
                if (
                    i === specCol[0] &&
                    value === specCol[0] &&
                    (tableName === "tblUserData" || tableName === "tblRowData")
                ) {
                    let content = "";
                    content +=
                        '<div class="input-group">' +
                        '<input type="date" id="datetimeFilter1" class="form-controll"  >' +
                        '<div class="input-group-addon">to</div>' +
                        '<input type="date" id="datetimeFilter2"  class="form-controll"   >' +
                        '<div style="margin: 10px 10px;"><input  type="checkbox" id="cbDate" onclick="checkDateNull(event, \' ' +
                        tableName +
                        "')\"  /> Null</div>" +
                        "</div>";
                    // content += '<input type="date" id="datetimeFilter" class="employee-search-input" >';
                    var newTemplate = $(
                        template
                        .replace("{0}", content)
                        .replace("{1}", value)
                        .replace("{1}", value)
                        .replace("{2}", tableName)
                        .replace("{2}", tableName)
                    );
                    $("body").append(newTemplate);
                    if (tableName === "tblAnswerData") {
                        modalFilterArray2[tableName + "_" + value] = newTemplate;
                    } else if (tableName === "tblUserData") {
                        modalFilterArray1[tableName + "_" + value] = newTemplate;
                    } else {
                        modalFilterArray3[tableName + "_" + value] = newTemplate;
                    }
                    content = "";
                } else if (
                    i === specCol[0] &&
                    value === specCol[0] &&
                    tableName === "tblAnswerData"
                ) {
                    let content = "";
                    let id = tableName + "_" + columnName + "_" + specCol[0];

                    content +=
                        '<div style="text-align: center;"><input type="checkbox" style="margin-right: 8px;" value="0,20"  id="' +
                        id +
                        '"/><label for="' +
                        id +
                        '"> ' +
                        0 +
                        " - " +
                        20 +
                        "</label></div>";
                    content +=
                        '<div style="text-align: center;"><input type="checkbox" style="margin-right: 8px;" value="21,40"  id="' +
                        id +
                        '"/><label for="' +
                        id +
                        '"> ' +
                        21 +
                        " - " +
                        40 +
                        "</label></div>";
                    content +=
                        '<div style="text-align: center;"><input type="checkbox" style="margin-right: 8px;" value="41,60"  id="' +
                        id +
                        '"/><label for="' +
                        id +
                        '"> ' +
                        41 +
                        " - " +
                        60 +
                        "</label></div>";
                    content +=
                        '<div style="text-align: center;"><input type="checkbox" style="margin-right: 8px;" value="60,150"  id="' +
                        id +
                        '"/><label for="' +
                        id +
                        '"> > ' +
                        61 +
                        "</label></div>";

                    var newTemplate = $(
                        template
                        .replace("{0}", content)
                        .replace("{1}", value)
                        .replace("{1}", value)
                        .replace("{2}", tableName)
                        .replace("{2}", tableName)
                    );
                    $("body").append(newTemplate);
                    if (tableName === "tblAnswerData") {
                        modalFilterArray2[tableName + "_" + value] = newTemplate;
                    } else if (tableName === "tblUserData") {
                        modalFilterArray1[tableName + "_" + value] = newTemplate;
                    } else {
                        modalFilterArray3[tableName + "_" + value] = newTemplate;
                    }
                    content = "";
                } else if (
                    i === specCol[1] &&
                    value === specCol[1] &&
                    tableName === "tblAnswerData"
                ) {
                    let content = "";
                    let id = tableName + "_" + columnName + "_" + specCol[1];
                    for (let i = 0; i < 10; i++) {
                        let from = i * 10;
                        let to = from + 9;
                        content +=
                            '<div style="text-align: center;"><input type="checkbox" style="margin-right: 8px;" value="' +
                            from +
                            "," +
                            to +
                            '"  id="' +
                            id +
                            '"/><label for="' +
                            id +
                            '"> ' +
                            from +
                            " - " +
                            to +
                            "</label></div>";
                    }
                    var newTemplate = $(
                        template
                        .replace("{0}", content)
                        .replace("{1}", value)
                        .replace("{1}", value)
                        .replace("{2}", tableName)
                        .replace("{2}", tableName)
                    );
                    $("body").append(newTemplate);
                    if (tableName === "tblAnswerData") {
                        modalFilterArray2[tableName + "_" + value] = newTemplate;
                    } else if (tableName === "tblUserData") {
                        modalFilterArray1[tableName + "_" + value] = newTemplate;
                    } else {
                        modalFilterArray3[tableName + "_" + value] = newTemplate;
                    }
                    content = "";
                } else if (
                    (i === specCol[2] &&
                        value === specCol[2] &&
                        tableName === "tblAnswerData") ||
                    (i === specCol[1] &&
                        value === specCol[1] &&
                        tableName === "tblRowData") ||
                    (i === specCol[3] &&
                        value === specCol[3] &&
                        tableName === "tblRowData")
                ) {
                    let content = "";
                    let id = tableName + "_" + columnName + "_" + specCol[0];

                    content +=
                        '<div style="text-align: center;"><input type="checkbox" style="margin-right: 8px;" value="-2, 525"  id="' +
                        id +
                        '"/><label for="' +
                        id +
                        '"> < 525' +
                        "</label></div>";
                    content +=
                        '<div style="text-align: center;"><input type="checkbox" style="margin-right: 8px;" value="525,1050"  id="' +
                        id +
                        '"/><label for="' +
                        id +
                        '"> ' +
                        525 +
                        " - " +
                        1050 +
                        "</label></div>";
                    content +=
                        '<div style="text-align: center;"><input type="checkbox" style="margin-right: 8px;" value="1051,1575"  id="' +
                        id +
                        '"/><label for="' +
                        id +
                        '"> ' +
                        1051 +
                        " - " +
                        1575 +
                        "</label></div>";
                    content +=
                        '<div style="text-align: center;"><input type="checkbox" style="margin-right: 8px;" value="1575,100000"  id="' +
                        id +
                        '"/><label for="' +
                        id +
                        '"> >1575' +
                        "</label></div>";

                    var newTemplate = $(
                        template
                        .replace("{0}", content)
                        .replace("{1}", value)
                        .replace("{1}", value)
                        .replace("{2}", tableName)
                        .replace("{2}", tableName)
                    );
                    $("body").append(newTemplate);
                    if (tableName === "tblAnswerData") {
                        modalFilterArray2[tableName + "_" + value] = newTemplate;
                    } else if (tableName === "tblUserData") {
                        modalFilterArray1[tableName + "_" + value] = newTemplate;
                    } else {
                        modalFilterArray3[tableName + "_" + value] = newTemplate;
                    }
                    content = "";
                } else if (
                    i === specCol[0] &&
                    value === specCol[0] &&
                    tableName === "tblAnswerData"
                ) {
                    let content = "";
                    let id = tableName + "_" + columnName + "_" + specCol[0];

                    content +=
                        '<div style="text-align: center;"><input type="checkbox" style="margin-right: 8px;" value="0,20"  id="' +
                        id +
                        '"/><label for="' +
                        id +
                        '"> ' +
                        0 +
                        " - " +
                        20 +
                        "</label></div>";
                    content +=
                        '<div style="text-align: center;"><input type="checkbox" style="margin-right: 8px;" value="21,40"  id="' +
                        id +
                        '"/><label for="' +
                        id +
                        '"> ' +
                        21 +
                        " - " +
                        40 +
                        "</label></div>";
                    content +=
                        '<div style="text-align: center;"><input type="checkbox" style="margin-right: 8px;" value="41,60"  id="' +
                        id +
                        '"/><label for="' +
                        id +
                        '"> ' +
                        41 +
                        " - " +
                        60 +
                        "</label></div>";
                    content +=
                        '<div style="text-align: center;"><input type="checkbox" style="margin-right: 8px;" value="60,150"  id="' +
                        id +
                        '"/><label for="' +
                        id +
                        '"> > ' +
                        61 +
                        "</label></div>";

                    var newTemplate = $(
                        template
                        .replace("{0}", content)
                        .replace("{1}", value)
                        .replace("{1}", value)
                        .replace("{2}", tableName)
                        .replace("{2}", tableName)
                    );
                    $("body").append(newTemplate);
                    if (tableName === "tblAnswerData") {
                        modalFilterArray2[tableName + "_" + value] = newTemplate;
                    } else if (tableName === "tblUserData") {
                        modalFilterArray1[tableName + "_" + value] = newTemplate;
                    } else {
                        modalFilterArray3[tableName + "_" + value] = newTemplate;
                    }
                    content = "";
                } else if (
                    i === specCol[1] &&
                    value === specCol[1] &&
                    tableName === "tblAnswerData"
                ) {
                    let content = "";
                    let id = tableName + "_" + columnName + "_" + specCol[1];
                    for (let i = 0; i < 10; i++) {
                        let from = i * 10;
                        let to = from + 9;
                        content +=
                            '<div style="text-align: center;"><input type="checkbox" style="margin-right: 8px;" value="' +
                            from +
                            "," +
                            to +
                            '"  id="' +
                            id +
                            '"/><label for="' +
                            id +
                            '"> ' +
                            from +
                            " - " +
                            to +
                            "</label></div>";
                    }
                    var newTemplate = $(
                        template
                        .replace("{0}", content)
                        .replace("{1}", value)
                        .replace("{1}", value)
                        .replace("{2}", tableName)
                        .replace("{2}", tableName)
                    );
                    $("body").append(newTemplate);
                    if (tableName === "tblAnswerData") {
                        modalFilterArray2[tableName + "_" + value] = newTemplate;
                    } else if (tableName === "tblUserData") {
                        modalFilterArray1[tableName + "_" + value] = newTemplate;
                    } else {
                        modalFilterArray3[tableName + "_" + value] = newTemplate;
                    }
                    content = "";
                } else if (
                    (i === specCol[2] &&
                        value === specCol[2] &&
                        tableName === "tblAnswerData") ||
                    (i === specCol[1] &&
                        value === specCol[1] &&
                        tableName === "tblRowData") ||
                    (i === specCol[3] &&
                        value === specCol[3] &&
                        tableName === "tblRowData")
                ) {
                    let content = "";
                    let id = tableName + "_" + columnName + "_" + specCol[0];

                    content +=
                        '<div style="text-align: center;"><input type="checkbox" style="margin-right: 8px;" value="-2, 525"  id="' +
                        id +
                        '"/><label for="' +
                        id +
                        '"> < 525' +
                        "</label></div>";
                    content +=
                        '<div style="text-align: center;"><input type="checkbox" style="margin-right: 8px;" value="525,1050"  id="' +
                        id +
                        '"/><label for="' +
                        id +
                        '"> ' +
                        525 +
                        " - " +
                        1050 +
                        "</label></div>";
                    content +=
                        '<div style="text-align: center;"><input type="checkbox" style="margin-right: 8px;" value="1051,1575"  id="' +
                        id +
                        '"/><label for="' +
                        id +
                        '"> ' +
                        1051 +
                        " - " +
                        1575 +
                        "</label></div>";
                    content +=
                        '<div style="text-align: center;"><input type="checkbox" style="margin-right: 8px;" value="1575,100000"  id="' +
                        id +
                        '"/><label for="' +
                        id +
                        '"> >1575' +
                        "</label></div>";

                    var newTemplate = $(
                        template
                        .replace("{0}", content)
                        .replace("{1}", value)
                        .replace("{1}", value)
                        .replace("{2}", tableName)
                        .replace("{2}", tableName)
                    );
                    $("body").append(newTemplate);
                    if (tableName === "tblAnswerData") {
                        modalFilterArray2[tableName + "_" + value] = newTemplate;
                    } else if (tableName === "tblUserData") {
                        modalFilterArray1[tableName + "_" + value] = newTemplate;
                    } else {
                        modalFilterArray3[tableName + "_" + value] = newTemplate;
                    }
                    content = "";
                } else if (
                    (i === specCol[3] &&
                        value === specCol[3] &&
                        tableName === "tblAnswerData") ||
                    (i === specCol[2] &&
                        value === specCol[2] &&
                        tableName === "tblRowData") ||
                    (i === specCol[4] &&
                        value === specCol[4] &&
                        tableName === "tblRowData")
                ) {
                    let content = "";
                    let id = tableName + "_" + columnName + "_" + specCol[0];

                    content +=
                        '<div style="text-align: center;"><input type="checkbox" style="margin-right: 8px;" value="0, 250"  id="' +
                        id +
                        '"/><label for="' +
                        id +
                        '"> < 250' +
                        "</label></div>";
                    content +=
                        '<div style="text-align: center;"><input type="checkbox" style="margin-right: 8px;" value="250,500"  id="' +
                        id +
                        '"/><label for="' +
                        id +
                        '"> ' +
                        250 +
                        " - " +
                        500 +
                        "</label></div>";
                    content +=
                        '<div style="text-align: center;"><input type="checkbox" style="margin-right: 8px;" value="501,750"  id="' +
                        id +
                        '"/><label for="' +
                        id +
                        '"> ' +
                        501 +
                        " - " +
                        750 +
                        "</label></div>";
                    content +=
                        '<div style="text-align: center;"><input type="checkbox" style="margin-right: 8px;" value="750,100000"  id="' +
                        id +
                        '"/><label for="' +
                        id +
                        '"> >750' +
                        "</label></div>";

                    var newTemplate = $(
                        template
                        .replace("{0}", content)
                        .replace("{1}", value)
                        .replace("{1}", value)
                        .replace("{2}", tableName)
                        .replace("{2}", tableName)
                    );
                    $("body").append(newTemplate);
                    if (tableName === "tblAnswerData") {
                        modalFilterArray2[tableName + "_" + value] = newTemplate;
                    } else if (tableName === "tblUserData") {
                        modalFilterArray1[tableName + "_" + value] = newTemplate;
                    } else {
                        modalFilterArray3[tableName + "_" + value] = newTemplate;
                    }
                    content = "";
                } else {
                    if (value === i) {
                        var column = this,
                            content =
                            '<input type="text" class="filterSearchText" onkeyup="filterValues(this)" /> <br/>';

                        var distinctArray = [];
                        column
                            .data()
                            .sort()
                            .each(function(d, j) {
                                if (distinctArray.indexOf(d) == -1) {
                                    var id = tableName + "_" + columnName + "_" + j; // onchange="formatValues(this,' + value + ');
                                    content +=
                                        '<div style="text-align: center;"><input type="checkbox" style="margin-right: 8px;" value="' +
                                        d +
                                        '"  id="' +
                                        id +
                                        '"/><label for="' +
                                        id +
                                        '"> ' +
                                        d +
                                        "</label></div>";
                                    distinctArray.push(d);
                                }
                            });
                        var newTemplate = $(
                            template
                            .replace("{0}", content)
                            .replace("{1}", value)
                            .replace("{1}", value)
                            .replace("{2}", tableName)
                            .replace("{2}", tableName)
                        );
                        $("body").append(newTemplate);
                        if (tableName === "tblAnswerData") {
                            modalFilterArray2[tableName + "_" + value] = newTemplate;
                        } else if (tableName === "tblUserData") {
                            modalFilterArray1[tableName + "_" + value] = newTemplate;
                        } else {
                            modalFilterArray3[tableName + "_" + value] = newTemplate;
                        }

                        content = "";
                    }
                }
            });
        });
    }, 50);
}

var modalFilterArray1 = {};
var modalFilterArray2 = {};
var modalFilterArray3 = {};

let posAnswerFilter = [];
//User to show the filter modal

function showFilter(e, index) {
    $(".modalFilter").hide();
    let tableName = index.split("_")[0];
    let col = index.split("_")[1];
    if (tableName === "tblAnswerData") {
        $(modalFilterArray2[index]).css({ left: 0, top: 0 });
        var th = $(e.target).parent();
        var pos = th.offset();

        $(modalFilterArray2[index]).width(100);

        $(modalFilterArray2[index]).css({ left: pos.left, top: pos.top });
        $(modalFilterArray2[index]).show();
    } else if (tableName === "tblUserData") {
        $(modalFilterArray1[index]).css({ left: 0, top: 0 });
        var th = $(e.target).parent();
        var pos = th.offset();
        $(modalFilterArray1[index]).width(150);

        $(modalFilterArray1[index]).css({ left: pos.left, top: pos.top });
        $(modalFilterArray1[index]).show();
    } else {
        $(modalFilterArray1[index]).css({ left: 0, top: 0 });
        var th = $(e.target).parent();
        var pos = th.offset();

        $(modalFilterArray3[index]).width(120);

        $(modalFilterArray3[index]).css({ left: pos.left, top: pos.top });
        $(modalFilterArray3[index]).show();
    }

    $("#mask").show();
    e.stopPropagation();
}

//This function is to use the searchbox to filter the checkbox
function filterValues(node) {
    var searchString = $(node).val().toUpperCase().trim();
    var rootNode = $(node).parent();
    if (searchString == "") {
        rootNode.find("div").show();
    } else {
        rootNode.find("div").hide();
        rootNode.find("div:contains('" + searchString + "')").show();
    }
}

//Execute the filter on the table for a given column
function performFilter(node, i, tableId) {
    if (!posAnswerFilter.includes(i) && tableId === "tblAnswerData") {
        posAnswerFilter.push(i);
    }

    var rootNode = $(node).parent().parent();
    var searchString = "",
        counter = 0;

    if (
        (i === 3 && tableId === "tblUserData") ||
        (i === 13 && tableId === "tblRowData")
    ) {
        let time = "";
        let arr = [],
            arrDate = [];
        timeFrom = rootNode
            .find("input#datetimeFilter1")[0]
            .value.replace("-", "/")
            .replace("-", "/");
        timeEnd = rootNode
            .find("input#datetimeFilter2")[0]
            .value.replace("-", "/")
            .replace("-", "/");

        if (i === 3) {
            if (userFilter.length === 0) {
                arr = filterDate(timeFrom, timeEnd, excelRowsUser, "TimeDate");
            } else {
                arr = filterDate(timeFrom, timeEnd, userFilter, "TimeDate");
            }
            arr.forEach((value) => {
                value = "^" + value[headerUser[3]] + "$";
                arrDate.push(value);
            });
        } else {
            arr = filterDate(timeFrom, timeEnd, result, "timedate");
            arr.forEach((value) => {
                value = "^" + value[header[13]];
                arrDate.push(value);
            });
        }

        console.log(arrDate.join("|"));
        searchString = arrDate.join("|");
        if (userDateNull || rawDataDateNull) {
            searchString += "|^$";
            userDateNull = false;
            rawDataDateNull = false;
        }

        // arr = time.split('-');
        // searchString = arr[2] + '/' + arr[1] + '/' + arr[0];
    } else {
        rootNode.find("input:checkbox").each(function(index, checkbox) {
            if (checkbox.checked) {
                searchString +=
                    counter == 0 ?
                    "^" + checkbox.value + "$" :
                    "|^" + checkbox.value + "$";
                counter++;
            }
        });
    }

    let resultSearch = [];
    let tmp = [];
    if (
        (i === 8 || i === 14 || i === 4 || i === 5) &&
        tableId === "tblAnswerData"
    ) {
        let result_tmp = getPositionFilterRange(
            excelRowsDapAn,
            searchString,
            headerAnswer,
            i
        );
        let arr = [];
        result_tmp.forEach((val) => {
            if (!arr.includes(val[headerAnswer[i]])) {
                arr.push("^" + val[headerAnswer[i]] + "$");
            }
        });
        if (result_tmp.length === 0) {
            searchString = "1000000000";
        } else {
            searchString = arr.join("|");
        }
    }

    if ((i === 7 || i === 8 || i === 5 || i === 6) && tableId === "tblRowData") {
        let result_tmp = getPositionFilterRange(result, searchString, header, i);
        let arr = [];
        result_tmp.forEach((val) => {
            if (!arr.includes(val[header[i]])) {
                arr.push("^" + val[header[i]] + "$");
            }
        });
        if (result_tmp.length === 0) {
            searchString = "1000000000";
        } else {
            searchString = arr.join("|");
        }
    }

    let datafilter = $("#" + tableId)
        .DataTable()
        .column(i)
        .search("^" + searchString + "$", true, false)
        .draw();
    resultSearch = datafilter.context[0].aiDisplay;

    if (tableId === "tblAnswerData") {
        resultSearch.forEach((value) => {
            tmp.push(excelRowsDapAn[value]);
        });
        answerFilter = Array.from(tmp);
        configFilter(
            $("#" + tableId)
            .DataTable()
            .rows({ search: "applied" })
            .columns({ search: "applied" }),
            "tblAnswerData", [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14], [8, 14, 4, 5]
        );
    } else if (tableId === "tblUserData") {
        resultSearch.forEach((value) => {
            tmp.push(excelRowsUser[value]);
        });
        userFilter = Array.from(tmp);

        configFilter(
            $("#" + tableId)
            .DataTable()
            .rows({ search: "applied" })
            .columns({ search: "applied" }),
            "tblUserData", [0, 1, 2, 3, 4, 5, 6, 7], [3]
        );
    } else {
        configFilter(
            $("#" + tableId)
            .DataTable()
            .rows({ search: "applied" })
            .columns({ search: "applied" }),
            "tblRowData", [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15], [13, 7, 8, 5, 6]
        );
    }

    rootNode.hide();
    $("#mask").hide();
}

function filterDate(dateFrom, dateTo, arr, variableName) {
    let result_tmp = [];
    // if(dateFrom !== ''){
    //     if(!dateFrom.includes(':')){
    //         dateFrom += ' 00:00:00';
    //    }else{
    //        dateFrom = dateFrom.split(' ')[0].split('/').reverse().join('/');
    //    }
    // }

    // if(dateTo !== ''){
    //     if(!dateTo.includes(':')){
    //         dateTo += ' 00:00:00';
    //    }else{
    //     dateTo = dateTo.split(' ')[0].split('/').reverse().join('/');
    //    }
    // }

    if (dateFrom === "") {
        arr.forEach((value, index) => {
            if (!(value[variableName] === null)) {
                if (value[variableName].includes(":")) {
                    value[variableName] = value[variableName].split(" ")[0];
                }
                let time = value[variableName].split("/").reverse().join("/");
                if (Date.parse(dateTo) >= Date.parse(time)) {
                    result_tmp.push(value);
                }
            }
        });
    } else if (dateTo === "") {
        arr.forEach((value, index) => {
            if (!(value[variableName] === null)) {
                if (value[variableName].includes(":")) {
                    value[variableName] = value[variableName].split(" ")[0];
                }
                let time = value[variableName].split("/").reverse().join("/");
                if (Date.parse(dateFrom) <= Date.parse(time)) {
                    result_tmp.push(value);
                }
            }
        });
    } else {
        arr.forEach((value, index) => {
            if (!(value[variableName] === null)) {
                if (value[variableName].includes(":")) {
                    value[variableName] = value[variableName].split(" ")[0];
                }
                let time = value[variableName].split("/").reverse().join("/");
                if (
                    Date.parse(dateFrom) <= Date.parse(time) &&
                    Date.parse(dateTo) >= Date.parse(time)
                ) {
                    result_tmp.push(value);
                }
            }
        });
    }
    console.log("RESULT CUONGHD");
    console.log(result_tmp);
    return result_tmp;
}

function getPositionFilterRange(arr, filter, headerArr, specPos) {
    let pos = [];

    while (filter.indexOf("^") >= 0) {
        filter = filter.replace("^", "");
    }
    while (filter.indexOf("$") >= 0) {
        filter = filter.replace("$", "");
    }

    let condition = filter.split("|");
    condition.forEach((v) => {
        let v1 = v.split(",");
        arr.forEach((value, index) => {
            let val = value[headerArr[specPos]];
            if (val !== undefined) {
                let min = v1[0];
                let max = v1[1];
                if (parseInt(min) <= parseInt(val) && parseInt(max) >= parseInt(val)) {
                    pos.push(value);
                }
            }
        });
    });
    return pos;
}

function clearDataFilter(tableid) {
    headerAnswer.forEach((val, index) => {
        $("#" + tableid)
            .DataTable()
            .column(index)
            .search("", true, false)
            .draw();
    });

    $(".modalFilter").find(".filterSearchText").val("");
    $(".modalFilter")
        .find("input:checkbox")
        .each(function(index, checkbox) {
            checkbox.checked = false;
            $(checkbox).parent().show();
        });

    if (tableid === "tblUserData") {
        configFilter(
            $("#" + tableid)
            .DataTable()
            .rows()
            .columns(),
            "tblUserData", [0, 1, 2, 3, 4, 5, 6, 7], [3]
        );
        userFilter = [];
    } else if (tableid === "tblAnswerData") {
        configFilter(
            $("#" + tableid)
            .DataTable()
            .rows()
            .columns(),
            "tblAnswerData", [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14], [8, 14, 4, 5]
        );
        answerFilter = [];
    } else {
        configFilter(
            $("#" + tableid)
            .DataTable()
            .rows()
            .columns(),
            "tblRowData", [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15], [13, 7, 8, 5, 6]
        );
    }
}

//Removes the filter from the table for a given column
function clearFilter(node, i, tableId) {
    let index = posAnswerFilter.indexOf(i);
    if (index !== -1) {
        posAnswerFilter.splice(index, 1);
    }

    var rootNode = $(node).parent().parent();
    rootNode.find(".filterSearchText").val("");
    rootNode.find("input:checkbox").each(function(index, checkbox) {
        checkbox.checked = false;
        $(checkbox).parent().show();
    });
    let datafilter = $("#" + tableId)
        .DataTable()
        .column(i)
        .search("", true, false)
        .draw();
    resultSearch = datafilter.context[0].aiDisplay;
    let tmp = [];
    if (tableId === "tblAnswerData") {
        resultSearch.forEach((value) => {
            tmp.push(excelRowsDapAn[value]);
        });
        answerFilter = Array.from(tmp);
        if (i === 0) {
            configFilter(
                $("#" + tableId)
                .DataTable()
                .rows()
                .columns(),
                "tblAnswerData", [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14], [8, 14, 4, 5]
            );
        } else {
            configFilter(
                $("#" + tableId)
                .DataTable()
                .rows()
                .columns(i, { search: "applied" }),
                "tblAnswerData", [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14], [8, 14, 4, 5]
            );
        }
    } else if (tableId === "tblUserData") {
        resultSearch.forEach((value) => {
            tmp.push(excelRowsUser[value]);
        });
        userFilter = Array.from(tmp);
        if (i === 0) {
            configFilter(
                $("#" + tableId)
                .DataTable()
                .rows()
                .columns(),
                "tblUserData", [0, 1, 2, 3, 4, 5, 6, 7], [3]
            );
        } else {
            configFilter(
                $("#" + tableId)
                .DataTable()
                .rows()
                .columns(i, { search: "applied" }),
                "tblUserData", [0, 1, 2, 3, 4, 5, 6, 7], [3]
            );
        }
    } else {
        configFilter(
            $("#" + tableId)
            .DataTable()
            .rows()
            .columns(),
            "tblRowData", [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15], [13, 7, 8, 5, 6]
        );
    }

    rootNode.hide();
    $("#mask").hide();
}

function Upload() {
    //Reference the FileUpload element.
    var fileUpload = document.getElementById("fileUpload");

    //Validate whether File is valid Excel file.
    var regex = /^([a-zA-Z0-9\s_\\.\-:])+(.xls|.xlsx)$/;
    if (regex.test(fileUpload.value.toLowerCase())) {
        if (typeof FileReader != "undefined") {
            var reader = new FileReader();
            $("#btnFilter").css("visibility", "visible");
            $("#dropdownOption").css("visibility", "visible");
            $("#dropdownCaseDensity").css("visibility", "visible");
            $("#dropdownlessionType").css("visibility", "visible");
            // $('body').addClass('loading');
            //For Browsers other than IE.
            if (reader.readAsBinaryString) {
                reader.onload = function(e) {
                    ProcessExcel(e.target.result);
                };
                reader.readAsBinaryString(fileUpload.files[0]);
            } else {
                //For IE Browser.
                reader.onload = function(e) {
                    var data = "";
                    var bytes = new Uint8Array(e.target.result);
                    for (var i = 0; i < bytes.byteLength; i++) {
                        data += String.fromCharCode(bytes[i]);
                    }
                    ProcessExcel(data);
                };
                reader.readAsArrayBuffer(fileUpload.files[0]);
            }
        } else {
            alert("This browser does not support HTML5.");
        }
    } else {
        alert("Please upload a valid Excel file.");
    }
}

function ProcessExcel(data) {
    //Read the Excel File data.
    var workbook = XLSX.read(data, {
        type: "binary",
        cellDates: true,
        cellStyles: true,
    });
    //Fetch the name of First Sheet.
    var sheetRawData = workbook.SheetNames[0];
    var sheetDapAn = workbook.SheetNames[1];
    var sheetUser = workbook.SheetNames[2];

    //Read all rows from First Sheet into an JSON array.
    excelRowsDapAn = XLSX.utils.sheet_to_row_object_array(
        workbook.Sheets[sheetDapAn], { raw: false, defval: null }
    );
    excelRowsRawData = XLSX.utils.sheet_to_row_object_array(
        workbook.Sheets[sheetRawData], { raw: false, defval: null }
    );
    excelRowsUser = XLSX.utils.sheet_to_row_object_array(
        workbook.Sheets[sheetUser], { raw: false, defval: null }
    );

    console.log("LST HEADER");
    let arr1 = Object.getOwnPropertyNames(excelRowsDapAn[0]);
    let arr2 = Object.getOwnPropertyNames(excelRowsUser[0]);
    let arr3 = Object.getOwnPropertyNames(excelRowsRawData[0]);
    header = arr3.slice(1, arr3.length);
    headerAnswer = arr1.slice(1, arr1.length);
    headerUser = arr2.slice(1, arr2.length);

    if (isInitTableUserData) {
        let dataset = convertlstUserToArray(excelRowsUser);
        tableUserData.clear().rows.add(dataset).draw();
        configFilter(
            tblUser.api().columns(),
            "tblUserData", [0, 1, 2, 3, 4, 5, 6, 7], [3]
        );
    } else {
        initTableUser(excelRowsUser);
    }

    if (isInitTableAnswerData) {
        let dataset = convertlstAnswer(excelRowsDapAn);
        tableAnswerData.clear().rows.add(dataset).draw();
        configFilter(
            tblAnswer.api().columns(),
            "tblAnswerData", [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14], [8, 14]
        );
    } else {
        initTableAnswer(excelRowsDapAn);
    }

    // $('body').removeClass("loading");

    // setTimeout(function(){

    // }, 100)
}

function coreCalculate(RowsRawData, RowsDapAn) {
    // CHU Y CO THEM SESSION_NO HAY KO ????
    // TINH TOAN MUC SO 1

    var checkType = "Abnormal";
    var matchListRawData = [];
    for (var i = 0; i < RowsRawData.length; i++) {
        // console.log("INDEX111", RowsRawData[i]["case_id"], RowsRawData[i]["test_id"])
        objIndex = RowsDapAn.findIndex(
            (obj) =>
            obj["Test set"] == RowsRawData[i]["test_id"] &&
            obj["Case ID"] == RowsRawData[i]["case_id"]
        );
        // console.log("AAAAAAAAAAAAAAA", objIndex)
        if (objIndex != -1) {
            matchListRawData.push(RowsRawData[i]);
        }
    }
    RowsRawData = matchListRawData;
    // console.log("USERFILTER", userFilter)
    switch (tagConfig) {
        case "1":
            for (var i = 0; i < userFilter.length; i++) {
                let rawdatabyUser = RowsRawData.filter(
                    (obj) =>
                    obj["user_id"] === userFilter[i]["user_id"] &&
                    obj["test_id"] === userFilter[i]["test_id"]
                );
                if (rawdatabyUser.length > 0) {
                    let filterDapan = RowsDapAn.filter(
                        (obj) => obj["Test set"] === rawdatabyUser[0]["test_id"]
                    );
                    filterDapan.forEach((element) => {
                        let diffIndex = rawdatabyUser.findIndex(
                            (obj) =>
                            element["Case ID"] === obj["case_id"] &&
                            element["Lesion ID"] === obj["lesionID"] &&
                            element["TruthX"] === obj["truthX"] &&
                            element["TruthY"] === obj["truthY"]
                        );
                        if (diffIndex == -1) {
                            RowsRawData.push({
                                ["test_id"]: rawdatabyUser[0]["test_id"],
                                ["user_id"]: rawdatabyUser[0]["user_id"],
                                ["session_no"]: rawdatabyUser[0]["session_no"],
                                ["case_id"]: element["Case ID"],
                                ["rating"]: "1",
                                ["selectX"]: -1,
                                ["selectY"]: -1,
                                ["truthX"]: element["TruthX"],
                                ["truthY"]: element["TruthY"],
                                ["lesionID"]: element["Lesion ID"],
                                ["frame"]: "",
                                ["slice"]: "",
                                ["distance"]: "",
                                ["timedate"]: "",
                                ["Case density (user)"]: "",
                                ["Lesion type(User)"]: "",
                            });
                        }
                    });
                }
            }
            break;

        default:
            break;
    }

    result = RowsRawData;

    switch (rateConfig) {
        case "1":
            result.forEach((element) => {
                if (element["rating"] == 2) {
                    element["rating"] = 1;
                }
            });
            break;

        default:
            break;
    }

    console.log("RAWDATA", RowsRawData);
    const uniqueTestId = [
        ...new Set(
            RowsRawData.map(
                (item) =>
                item["test_id"] +
                ":" +
                item["user_id"] +
                ":" +
                item["case_id"] +
                ":" +
                item["session_no"]
            )
        ),
    ];
    //console.log("LENGHT = " + uniqueTestId.length);

    uniqueTestId.forEach(function(unique) {
        {
            checkType = "Abnormal";
            objDapAnSymmetricTrue = [];
            objDapAnSymmetricFalse = [];
            objDapAnNonSymmetricTrue = [];
            objDapAnNonSymmetricFalse = [];
            const arrUnique = splitUniqueTest(unique);
            const objRowData = RowsRawData.filter(
                (obj) =>
                obj["test_id"] === arrUnique[0] &&
                obj["user_id"] === arrUnique[1] &&
                obj["case_id"] === arrUnique[2] &&
                obj["session_no"] === arrUnique[3]
            ).map((obj) => obj);
            const objDapAn = RowsDapAn.filter(
                (obj) =>
                obj["Test set"] == arrUnique[0] && obj["Case ID"] == arrUnique[2]
            ).map((obj) => obj);

            // FILL DATA CÒN THIẾU

            let objRowDataDensity = RowsRawData.filter(
                (obj) =>
                obj["test_id"] == arrUnique[0] &&
                obj["user_id"] == arrUnique[1] &&
                obj["case_id"] == arrUnique[2]
            ).map((obj) => obj);

            // if (arrUnique[1] === "hcmc028" && arrUnique[2] === "40") {
            //     console.log("OBJ DENSITY", objRowDataDensity)
            // }
            // COUNT DENSITY R JR FR
            objRowDataDensity.forEach((element) => {
                let checkDensity = RowsDapAn.filter(
                    (obj) =>
                    obj["Test set"] === element["test_id"] &&
                    obj["Case ID"] === element["case_id"] &&
                    caseDensityArrayValue.indexOf(obj["Case density"]) != -1 &&
                    obj["Case density"] === element["Case density (user)"]
                ).map((obj) => obj);
                if (checkDensity.length > 0) {
                    countDensityRJRFR = 1;
                }
            });

            // COUNT LESION R
            // COUNT LESION R
            // COUNT LESION R
            // COUNT LESION R
            // COUNT LESION R
            objRowDataDensity.forEach((element) => {
                let checkLesion = RowsDapAn.filter(
                    (obj) =>
                    obj["Test set"] === element["test_id"] &&
                    obj["Case ID"] === element["case_id"] &&
                    parseInt(element["distance"]) > 0 &&
                    (isLessionType ?
                        checkLesionType(
                            obj["Lesion type"],
                            element["Lesion type(User)"]
                        ) === true :
                        true)
                ).map((obj) => obj);
                if (checkLesion.length > 0) {
                    countLesionR = 1;
                }
            });

            // START TÍNH TOÁN
            calcR(objRowData, objDapAn);
            calcJRSymmetric(objRowData, objDapAn);
            calcJRNonSymmetric(objRowData, objDapAn);
            calcFR(objRowData, objDapAn);
            countDensityRJRFR = 0;
            countLesionR = 0;
            objDapAn.forEach((item) => {
                // if (item["Lesion ID"] == null && item["Frame"] == null
                //     && item["Lesion type"] == null && item["Lesion size (mm)"] == null) {
                //     checkType = "Normal";
                // }
                if (item["Case Type"] === "Normal") {
                    checkType = "Normal";
                }
            });

            // Divide CASE NORMAL || AB-NORMAL
            if (checkType == "Normal") {
                if (calcNormal(objRowData, objDapAn) == true) {
                    checkDistinctTrueAnswer(
                        arrUnique[0],
                        arrUnique[1],
                        listExportDataNormal,
                        arrUnique[3],
                        objDapAn,
                        "Normal"
                    );
                } else {
                    checkDistinctTotalAnswer(
                        arrUnique[0],
                        arrUnique[1],
                        listExportDataNormal,
                        arrUnique[3],
                        objDapAn,
                        "Normal"
                    );
                }
            }
            // Case anormal
            else {
                // Case AbNormal
                if (calcAbNormal(objRowData, objDapAn) == true) {
                    checkDistinctTrueAnswer(
                        arrUnique[0],
                        arrUnique[1],
                        listExportDataAbnormal,
                        arrUnique[3],
                        objDapAn,
                        "AbNormal"
                    );
                } else {
                    checkDistinctTotalAnswer(
                        arrUnique[0],
                        arrUnique[1],
                        listExportDataAbnormal,
                        arrUnique[3],
                        objDapAn,
                        "AbNormal"
                    );
                }
                // Case Recall
                if (calcReCall(objRowData, objDapAn) == true) {
                    checkDistinctTrueAnswer(
                        arrUnique[0],
                        arrUnique[1],
                        listExportDataRecall,
                        arrUnique[3],
                        objDapAn,
                        "Recall"
                    );
                } else {
                    checkDistinctTotalAnswer(
                        arrUnique[0],
                        arrUnique[1],
                        listExportDataRecall,
                        arrUnique[3],
                        objDapAn,
                        "Recall"
                    );
                }

                objRowData.forEach((element) => {
                    let checkDensity = RowsDapAn.filter(
                        (obj) =>
                        obj["Test set"] === element["test_id"] &&
                        obj["Case ID"] === element["case_id"] &&
                        caseDensityArrayValue.indexOf(obj["Case density"]) != -1 &&
                        obj["Case density"] === element["Case density (user)"]
                    ).map((obj) => obj);
                    if (checkDensity.length > 0) {
                        countDensity = 1;
                    }
                });
                var symmetric = calcSymmetric(objRowData, objDapAn);
                checkDistinctSymmetric(
                    arrUnique[0],
                    arrUnique[1],
                    listExportDataSymmetric,
                    arrUnique[3],
                    symmetric[0],
                    symmetric[1],
                    objDapAn,
                    "Symmetric",
                    symmetric[2],
                    symmetric[3]
                );
                var non_symmetric = calcNonSymmetric(objRowData, objDapAn);
                //checkDistinctNonSymmetric(arrUnique[0], arrUnique[1], listExportDataNonSymmetric, arrUnique[3], non_symmetric[0], non_symmetric[1], objDapAn, "NonSymmetric")
                checkDistinctNonSymmetric1(
                    arrUnique[0],
                    arrUnique[1],
                    listExportDataNonSymmetric,
                    arrUnique[3],
                    non_symmetric[0],
                    non_symmetric[1],
                    objDapAn,
                    "NonSymmetric",
                    non_symmetric[2],
                    non_symmetric[3]
                );
            }

            countDensity = 0;
        }
    });

    // TINH TOAN MUC SO 2
    // TINH TOAN MUC SO 2
    // TINH TOAN MUC SO 2
    // TINH TOAN MUC SO 2
    // TINH TOAN MUC SO 2
    listCaseIdbyTestId = [];
    dropdownArrayValue.forEach(function(dropdownValue) {
        switch (dropdownValue) {
            case "3":
                const uniqueTestIdbyUser1 = [
                    ...new Set(
                        RowsRawData.map(
                            (item) =>
                            item["test_id"] +
                            ":" +
                            item["user_id"] +
                            ":" +
                            item["case_id"] +
                            ":" +
                            item["lesionID"] +
                            ":" +
                            item["truthX"] +
                            ":" +
                            item["truthY"]
                        )
                    ),
                ];
                uniqueTestIdbyUser1.forEach(function(unique) {
                    {
                        const arrUnique = splitUniqueTest(unique);
                        const objRowData = RowsRawData.filter(
                            (obj) =>
                            obj["test_id"] == arrUnique[0] &&
                            obj["user_id"] == arrUnique[1] &&
                            obj["case_id"] == arrUnique[2] &&
                            obj["lesionID"] == arrUnique[3] &&
                            obj["truthX"] == arrUnique[4] &&
                            obj["truthY"] == arrUnique[5]
                        ).map((obj) => obj);
                        const objDapAn = RowsDapAn.filter(
                            (obj) =>
                            obj["Test set"] == arrUnique[0] &&
                            obj["Case ID"] == arrUnique[2] &&
                            obj["Lesion ID"] == arrUnique[3] &&
                            obj["TruthX"] == arrUnique[4] &&
                            obj["TruthY"] == arrUnique[5]
                        ).map((obj) => obj);

                        let objRowDataDensity = RowsRawData.filter(
                            (obj) =>
                            obj["test_id"] == arrUnique[0] &&
                            obj["user_id"] == arrUnique[1] &&
                            obj["case_id"] == arrUnique[2]
                        ).map((obj) => obj);

                        // if (arrUnique[1] === "hcmc028" && arrUnique[2] === "40") {
                        //     console.log("OBJ DENSITY", objRowDataDensity)
                        // }
                        objRowDataDensity.forEach((element) => {
                            let checkDensity = RowsDapAn.filter(
                                (obj) =>
                                obj["Test set"] === element["test_id"] &&
                                obj["Case ID"] === element["case_id"] &&
                                caseDensityArrayValue.indexOf(obj["Case density"]) != -1 &&
                                obj["Case density"] === element["Case density (user)"]
                            ).map((obj) => obj);
                            if (checkDensity.length > 0) {
                                countDensity = 1;
                            }
                        });

                        objDapAn.forEach((element) => {
                            if (element["Case Type"] === "Abnormal") {
                                const list = [];
                                list.push(element);
                                calcTruePercentofAnyLesionDX(objRowData, list);
                            }
                        });

                        countDensity = 0;
                    }
                });
                break;

            case "4":
                const uniqueTestIdbyUser = [
                    ...new Set(
                        RowsRawData.map(
                            (item) =>
                            item["test_id"] +
                            ":" +
                            item["user_id"] +
                            ":" +
                            item["case_id"] +
                            ":" +
                            item["lesionID"]
                        )
                    ),
                ];
                console.log("UNIQUEEEE", uniqueTestIdbyUser);
                uniqueTestIdbyUser.forEach(function(unique) {
                    {
                        const arrUnique = splitUniqueTest(unique);
                        const objRowData = RowsRawData.filter(
                            (obj) =>
                            obj["test_id"] == arrUnique[0] &&
                            obj["user_id"] == arrUnique[1] &&
                            obj["case_id"] == arrUnique[2] &&
                            obj["lesionID"] == arrUnique[3]
                        ).map((obj) => obj);
                        const objDapAn = RowsDapAn.filter(
                            (obj) =>
                            obj["Test set"] == arrUnique[0] &&
                            obj["Case ID"] == arrUnique[2] &&
                            obj["Lesion ID"] == arrUnique[3]
                        ).map((obj) => obj);

                        ///////////////////////////////////
                        let objRowDataDensity = RowsRawData.filter(
                            (obj) =>
                            obj["test_id"] == arrUnique[0] &&
                            obj["user_id"] == arrUnique[1] &&
                            obj["case_id"] == arrUnique[2]
                        ).map((obj) => obj);

                        // if (arrUnique[1] === "hcmc028" && arrUnique[2] === "40") {
                        //     console.log("OBJ DENSITY", objRowDataDensity)
                        // }
                        objRowDataDensity.forEach((element) => {
                            let checkDensity = RowsDapAn.filter(
                                (obj) =>
                                obj["Test set"] === element["test_id"] &&
                                obj["Case ID"] === element["case_id"] &&
                                caseDensityArrayValue.indexOf(obj["Case density"]) != -1 &&
                                obj["Case density"] === element["Case density (user)"]
                            ).map((obj) => obj);
                            if (checkDensity.length > 0) {
                                countDensity = 1;
                            }
                        });
                        let objDapAnClone = [];
                        //////////////////////////

                        objDapAn.forEach((element) => {
                            let index = objDapAnClone.findIndex(
                                (obj) =>
                                obj["Test set"] === element["Test set"] &&
                                obj["Case ID"] === element["Case ID"] &&
                                obj["Lesion ID"] === element["Lesion ID"]
                            );
                            if (index == -1) {
                                objDapAnClone.push(element);
                            }
                        });
                        objDapAnClone.forEach((element) => {
                            if (element["Case Type"] === "Abnormal") {
                                const list = [];
                                list.push(element);
                                calcTruePercentofAnyLesionKDX(objRowData, list);
                            }
                        });

                        countDensity = 0;
                    }
                });
                break;
            case "1":
                const uniqueTestIdbyUser2 = [
                    ...new Set(
                        RowsRawData.map(
                            (item) =>
                            item["test_id"] + ":" + item["user_id"] + ":" + item["case_id"]
                        )
                    ),
                ];
                uniqueTestIdbyUser2.forEach(function(unique) {
                    {
                        const arrUnique = splitUniqueTest(unique);
                        const objRowData = RowsRawData.filter(
                            (obj) =>
                            obj["test_id"] == arrUnique[0] &&
                            obj["user_id"] == arrUnique[1] &&
                            obj["case_id"] == arrUnique[2]
                        ).map((obj) => obj);
                        const objDapAn = RowsDapAn.filter(
                            (obj) =>
                            obj["Test set"] == arrUnique[0] && obj["Case ID"] == arrUnique[2]
                        ).map((obj) => obj);

                        let objDapAnNormal = [];
                        let objRowDataNormal = [];
                        objDapAn.forEach((item) => {
                            if (item["Case Type"] === "Normal") {
                                objDapAnNormal.push(item);
                            }
                        });

                        objRowData.forEach((element) =>
                            objDapAnNormal.forEach((element1) => {
                                if (
                                    element["test_id"] == element1["Test set"] &&
                                    element["case_id"] == element1["Case ID"]
                                ) {
                                    objRowDataNormal.push(element);
                                    return false;
                                }
                            })
                        );
                        calcTruePercentofAnyCase(objRowDataNormal, objDapAnNormal, dropdownValue);
                    }
                });
                break;
            case "2":
                const uniqueTestIdbyUser3 = [
                    ...new Set(
                        RowsRawData.map(
                            (item) =>
                            item["test_id"] + ":" + item["user_id"] + ":" + item["case_id"]
                        )
                    ),
                ];
                uniqueTestIdbyUser3.forEach(function(unique) {
                    {
                        const arrUnique = splitUniqueTest(unique);
                        let objRowData = RowsRawData.filter(
                            (obj) =>
                            obj["test_id"] == arrUnique[0] &&
                            obj["user_id"] == arrUnique[1] &&
                            obj["case_id"] == arrUnique[2]
                        ).map((obj) => obj);
                        const objDapAn = RowsDapAn.filter(
                            (obj) =>
                            obj["Test set"] == arrUnique[0] && obj["Case ID"] == arrUnique[2]
                        ).map((obj) => obj);

                        let objDapAnAbNormal = [];
                        let objRowDataAbNormal = [];
                        objDapAn.forEach((item) => {
                            if (item["Case Type"] === "Abnormal") {
                                objDapAnAbNormal.push(item);
                            }
                        });

                        objRowData.forEach((element) =>
                            objDapAnAbNormal.forEach((element1) => {
                                if (
                                    element["test_id"] == element1["Test set"] &&
                                    element["case_id"] == element1["Case ID"]
                                ) {
                                    objRowDataAbNormal.push(element);
                                    return false;
                                }
                            })
                        );
                        calcTruePercentofAnyCase(objRowDataAbNormal, objDapAnAbNormal, dropdownValue);
                    }
                });
                break;

            case "5":
                const uniqueTestIdbyUser4 = [
                    ...new Set(
                        RowsRawData.map(
                            (item) =>
                            item["test_id"] + ":" + item["user_id"] + ":" + item["case_id"]
                        )
                    ),
                ];
                uniqueTestIdbyUser4.forEach(function(unique) {
                    {
                        const arrUnique = splitUniqueTest(unique);
                        let objRowData = RowsRawData.filter(
                            (obj) =>
                            obj["test_id"] == arrUnique[0] &&
                            obj["user_id"] == arrUnique[1] &&
                            obj["case_id"] == arrUnique[2]
                        ).map((obj) => obj);
                        const objDapAn = RowsDapAn.filter(
                            (obj) =>
                            obj["Test set"] == arrUnique[0] && obj["Case ID"] == arrUnique[2]
                        ).map((obj) => obj);

                        let objDapAnAbNormal = [];
                        let objRowDataAbNormal = [];
                        objDapAn.forEach((item) => {
                            if (item["Case Type"] === "Abnormal") {
                                objDapAnAbNormal.push(item);
                            }
                        });

                        objRowData.forEach((element) =>
                            objDapAnAbNormal.forEach((element1) => {
                                if (
                                    element["test_id"] == element1["Test set"] &&
                                    element["case_id"] == element1["Case ID"]
                                ) {
                                    objRowDataAbNormal.push(element);
                                    return false;
                                }
                            })
                        );
                        calcTruePercentofAnyCase(objRowDataAbNormal, objDapAnAbNormal, dropdownValue);
                    }
                });
                break;
        }
    });

    // listFrame.forEach(element => {
    //     if (element["userId"] === "adel01") {
    //         console.log("CHECK ELEMENT", element)
    //     }
    // });

    // TINH TOAN R
    // TINH TOAN R
    // TINH TOAN R
    // TINH TOAN R
    // TINH TOAN R
    console.log("LIST EXPORT DATA!");
    console.log(listExportDataNormal);
    console.log(listExportDataAbnormal);
    console.log(listExportDataRecall);
    console.log(listExportDataSymmetric);
    console.log(listExportDataNonSymmetric);
    console.log("LIST REPORT 2  ", listCaseIdbyTestId);
    // console.log(listCaseIdbyTestId);
    console.log("LIST FRAME R");
    //console.log(listFrameFR);
    // listFrame.forEach(element => {
    //     console.log(element.caseId + " - " + element.rating + " - " + element.type)
    // });
    listFrame.forEach((element) => {
        if (element["rating"] == 0) {
            element["rating"] = 1;
        }
    });
    checkProbabilityRating(listFrame, "R");
    checkProbabilityRating(listFrameJRSymmetric, "JRDX");
    checkProbabilityRating(listFrameJRNonSymmetric, "JRKDX");
    checkProbabilityRating(listFrameFR, "FR");
}

function exportExcel() {
    const myHeader = {
        testId: "Test ID",
        userId: "User ID",
        sessionNo: "Session No",
        listCaseIdTrue: "Case Id True",
        listCaseIdFalse: "Case ID False",
        percentType: "Percent Type",
        percent: "Percent",
        numberCaseTrue: "Number Case True",
        totalCase: "Total Case",
        listAgeTrue: "Age True",
        listAgeFalse: "Age False",
        listCaseDensityTrue: "Case Density True",
        listCaseDensityFalse: "Case Density False",
        listLesionTypeTrue: "Lesion Type True",
        listLesionTypeFalse: "Lesion Type False",
        listLesionSideTrue: "Lesion Side True",
        listLesionSideFalse: "Lesion Side False",
        listLesionSiteTrue: "Lesion Site True",
        listLesionSiteFalse: "Lesion Site False",
        listLesionSizeTrue: "Lesion Size (mm) True",
        listLesionSizeFalse: "Lesion Size (mm) False",
        userAddress: "User Address",
        userGroup: "User Group",
        userTime: "User Time",
        userExp: "User Experience",
    };
    var myHeader2 = {
        testId: "Test ID",
        caseId: "Case ID",
        lesionId: "LesionID",
        truthX: "Truth X",
        truthY: "Truth Y",
        totalUserTruth: "Total True",
        totalUser: "Total",
        listUserIdTrue: "List User Id True",
        listUserAddressTrue: "Address True",
        listUserGroupTrue: "Group True",
        listUserTimeTrue: "Time True",
        listUserExpTrue: "Exp True",
        listUserIdFalse: "List User Id False",
        listUserAddressFalse: "Address False",
        listUserGroupFalse: "Group False",
        listUserTimeFalse: "Time False",
        listUserExpFalse: "Exp False",
        listAge: "Age",
        listCaseDensity: "Case Density",
        listLesionType: "Lesion Type",
        type: "Type",
        lesionSide: "Lesion side",
        lesionSite: "Lesion site",
        lesionSize: "Lesion size (mm)",
    };

    const myHeaderRawData = {
        testId: "test_id",
        userId: "user_id",
        sessionNo: "session_no",
        caseId: "case_id",
        rate: "rating",
        selectX: "selectX",
        selectY: "selectY",
        truthX: "truthX",
        truthY: "truthY",
        lesionID: "lesionID",
        frame: "frame",
        slice: "slice",
        distance: "distance",
        timedate: "timedate",
        caseDensity: "Case density (user)",
        lessionType: "Lesion type(User)",
    };

    const myHeaderDapAn = {
        testId: "Test set",
        caseId: "Case ID",
        type: "Case type",
        lesionId: "Lesion ID",
        TruthX: "TruthX",
        TruthY: "TruthY",
        truthOrder: "Truth Order",
        frame: "Frame",
        slice: "Slice",
        age: "Tuổi",
        prior: "Prior (Y/N)",
        caseDensity: "Case density",
        lesionType: "Lesion type",
        lesionSide: "Lesion side",
        lesionSite: "Lesion site",
        lesionSize: "Lesion size (mm)",
    };

    const myHeaderUser = {
        testId: "test_id",
        caseId: "user_id",
        sessonNo: "session_no",
        timeDate: "TimeDate",
        address: "Địa chỉ",
        group: "Nhóm",
        hour: "Số giờ",
        yearExp: "Số năm kinh nghiệm",
    };

    let headerR = {
        userId: "UserID",
        a: "a",
        b: "b",
        c: "c",
    };

    const headerJRDX = {
        userId: "UserID",
        a: "a",
        b: "b",
        c: "c",
    };

    const headerJRKDX = {
        userId: "UserID",
        a: "a",
        b: "b",
        c: "c",
    };

    const headerFR = {
        userId: "UserID",
        a: "a",
        b: "b",
        c: "c",
    };

    // var tab_1 = [], tab_2 = [], tab_3 = [], tab_4 = [], tab_5 = [];
    // var tab_6 = [], tab_7 = [], tab_8 = [], tab_9 = []
    listExportDataNormal.forEach((element) => {
        element.testId = !isNaN(element.testId) ?
            parseInt(element.testId) :
            element.testId;
        element.sessionNo = !isNaN(element.sessionNo) ?
            parseInt(element.sessionNo) :
            element.sessionNo;
        element.userGroup = !isNaN(element.userGroup) ?
            parseInt(element.userGroup) :
            element.userGroup;
        element.userExp = !isNaN(element.userExp) ?
            parseInt(element.userExp) :
            element.userExp;
        tab_1.push(element);
    });
    listExportDataAbnormal.forEach((element) => {
        element.testId = !isNaN(element.testId) ?
            parseInt(element.testId) :
            element.testId;
        element.sessionNo = !isNaN(element.sessionNo) ?
            parseInt(element.sessionNo) :
            element.sessionNo;
        element.userGroup = !isNaN(element.userGroup) ?
            parseInt(element.userGroup) :
            element.userGroup;
        element.userExp = !isNaN(element.userExp) ?
            parseInt(element.userExp) :
            element.userExp;
        tab_1.push(element);
    });
    listExportDataRecall.forEach((element) => {
        element.testId = !isNaN(element.testId) ?
            parseInt(element.testId) :
            element.testId;
        element.sessionNo = !isNaN(element.sessionNo) ?
            parseInt(element.sessionNo) :
            element.sessionNo;
        element.userGroup = !isNaN(element.userGroup) ?
            parseInt(element.userGroup) :
            element.userGroup;
        element.userExp = !isNaN(element.userExp) ?
            parseInt(element.userExp) :
            element.userExp;
        tab_1.push(element);
    });
    listExportDataSymmetric.forEach((element) => {
        element.testId = !isNaN(element.testId) ?
            parseInt(element.testId) :
            element.testId;
        element.sessionNo = !isNaN(element.sessionNo) ?
            parseInt(element.sessionNo) :
            element.sessionNo;
        element.userGroup = !isNaN(element.userGroup) ?
            parseInt(element.userGroup) :
            element.userGroup;
        element.userExp = !isNaN(element.userExp) ?
            parseInt(element.userExp) :
            element.userExp;
        tab_1.push(element);
    });
    listExportDataNonSymmetric.forEach((element) => {
        element.testId = !isNaN(element.testId) ?
            parseInt(element.testId) :
            element.testId;
        element.sessionNo = !isNaN(element.sessionNo) ?
            parseInt(element.sessionNo) :
            element.sessionNo;
        element.userGroup = !isNaN(element.userGroup) ?
            parseInt(element.userGroup) :
            element.userGroup;
        element.userExp = !isNaN(element.userExp) ?
            parseInt(element.userExp) :
            element.userExp;
        tab_1.push(element);
    });
    listR.forEach((element) => {
        element.testId = !isNaN(element.testId) ?
            parseInt(element.testId) :
            element.testId;
        tab_1.push(element);
    });
    listJRSymmetric.forEach((element) => {
        element.testId = !isNaN(element.testId) ?
            parseInt(element.testId) :
            element.testId;
        tab_1.push(element);
    });
    listJRNonSymmetric.forEach((element) => {
        element.testId = !isNaN(element.testId) ?
            parseInt(element.testId) :
            element.testId;
        tab_1.push(element);
    });
    listFR.forEach((element) => {
        element.testId = !isNaN(element.testId) ?
            parseInt(element.testId) :
            element.testId;
        tab_1.push(element);
    });

    listCaseIdbyTestId.forEach(element => {
        element.testId = element.testId ?
            parseInt(element.testId) :
            "";
        element.caseId = element.caseId ?
            parseInt(element.caseId) :
            element.caseId;
        element.lesionId = element.lesionId ?
            parseInt(element.lesionId) :
            "";
        element.truthX = element.truthX ?
            parseInt(element.truthX) :
            "";
        element.truthY = element.truthY ?
            parseInt(element.truthY) :
            "";
        tab_2.push(element);
    });

    answerFilter.forEach((element) => {
        element["Test set"] = !isNaN(element["Test set"]) ?
            parseInt(element["Test set"]) :
            element["Test set"];
        element["Case ID"] = !isNaN(element["Case ID"]) ?
            parseInt(element["Case ID"]) :
            element["Case ID"];
        element["Lesion ID"] = parseInt(element["Lesion ID"]);
        element["TruthX"] = parseInt(element["TruthX"]);
        element["TruthY"] = parseInt(element["TruthY"]);
        element["Frame"] = parseInt(element["Frame"]);
        element["Slice"] = parseInt(element["Slice"]);
        element["Tuổi"] = parseInt(element["Tuổi"]);
        element["Case density"] = parseInt(element["Case density"]);
        element["Lesion size (mm)"] = parseInt(element["Lesion size (mm)"]);
        tab_3.push(element);
    });

    userFilter.forEach((element) => {
        element["test_id"] = !isNaN(element["test_id"]) ?
            parseInt(element["test_id"]) :
            element["test_id"];
        element["session_no"] = parseInt(element["session_no"]);
        element["Nhóm"] = parseInt(element["Nhóm"]);
        element["Số năm kinh nghiệm"] = parseInt(element["Số năm kinh nghiệm"]);
        tab_4.push(element);
    });

    result.forEach((element) => {
        element["test_id"] = !isNaN(element["test_id"]) ?
            parseInt(element["test_id"]) :
            element["test_id"];
        element["session_no"] = parseInt(element["session_no"]);
        element["case_id"] = !isNaN(element["case_id"]) ?
            parseInt(element["case_id"]) :
            element["case_id"];
        element["rating"] = parseInt(element["rating"]);
        element["selectX"] = parseInt(element["selectX"]);
        element["selectY"] = parseInt(element["selectY"]);
        element["truthX"] = parseInt(element["truthX"]);
        element["truthY"] = parseInt(element["truthY"]);
        element["lesionID"] = parseInt(element["lesionID"]);
        element["frame"] = parseInt(element["frame"]);
        element["slice"] = parseInt(element["slice"]);
        element["distance"] = parseInt(element["distance"]);
        element["Case density (user)"] = parseInt(element["Case density (user)"]);
        tab_5.push(element);
    });

    listExportN1toN5_R.forEach((element) => {
        tab_6.push(element);
    });

    listExportN1toN5_JRDX.forEach((element) => {
        tab_7.push(element);
    });

    listExportN1toN5_JRKDX.forEach((element) => {
        tab_8.push(element);
    });

    listExportN1toN5_FR.forEach((element) => {
        tab_9.push(element);
    });

    // format header
    tab_1.unshift(myHeader);
    tab_2.unshift(myHeader2);
    tab_3.unshift(myHeaderDapAn);
    tab_4.unshift(myHeaderUser);
    tab_5.unshift(myHeaderRawData);
    tab_6.unshift(headerR);
    tab_7.unshift(headerJRDX);
    tab_8.unshift(headerJRKDX);
    tab_9.unshift(headerFR);
    // console.log("LISTTTT");
    // console.log(list);
    let excel = XlsxPopulate.fromBlankAsync()
        .then((workbook) => {
            // Add sheet the workbook.
            let sheet1 = workbook.addSheet("Report_1");
            let sheet2 = workbook.addSheet("Report_2");
            let sheet3 = workbook.addSheet("Dap An");
            let sheet4 = workbook.addSheet("User");
            let sheet5 = workbook.addSheet("Raw Data");
            let sheet6 = workbook.addSheet("Ket qua R");
            let sheet7 = workbook.addSheet("Ket qua JRDX");
            let sheet8 = workbook.addSheet("Ket qua JRDKX");
            let sheet9 = workbook.addSheet("Ket qua FR");
            sheet1.cell("A1").value(convertArrayObjectToNestedArray(tab_1));
            sheet2.cell("A1").value(convertArrayObjectToNestedArray(tab_2));
            sheet3.cell("A1").value(convertArrayObjectToNestedArray(tab_3));
            sheet4.cell("A1").value(convertArrayObjectToNestedArray(tab_4));
            sheet5.cell("A1").value(convertArrayObjectToNestedArray(tab_5));
            sheet6.cell("A1").value(convertArrayObjectToNestedArray(tab_6));
            sheet7.cell("A1").value(convertArrayObjectToNestedArray(tab_7));
            sheet8.cell("A1").value(convertArrayObjectToNestedArray(tab_8));
            sheet9.cell("A1").value(convertArrayObjectToNestedArray(tab_9));
            sheet1 = setHeaderStyleAndAutoFillter(sheet1);
            sheet2 = setHeaderStyleAndAutoFillter(sheet2);
            sheet3 = setHeaderStyleAndAutoFillter(sheet3);
            sheet4 = setHeaderStyleAndAutoFillter(sheet4);
            sheet5 = setHeaderStyleAndAutoFillter(sheet5);
            sheet6 = setHeaderStyleAndAutoFillter(sheet6);
            sheet7 = setHeaderStyleAndAutoFillter(sheet7);
            sheet8 = setHeaderStyleAndAutoFillter(sheet8);
            sheet9 = setHeaderStyleAndAutoFillter(sheet9);
            // Activate the sheet
            sheet1.active(true);
            // sheet2.active(true);
            // sheet3.active(true);
            // sheet4.active(true);
            // sheet5.active(true);

            // Delete 'Sheet1'
            workbook.deleteSheet("Sheet1");

            // sheet to file.
            generateBlob(workbook);
        })
        .then(() => {
            setTimeout(function() {
                // location.reload()
                tableRowData.clear().draw();
            }, 2000);
        });

    // location.reload();
    // setTimeout(function () {
    //     location.reload()
    // }, 1000);
}

function generateBlob(workbook, type) {
    return workbook
        .outputAsync({ type: type })
        .then(function(blob) {
            if (window.navigator && window.navigator.msSaveOrOpenBlob) {
                window.navigator.msSaveOrOpenBlob(blob, "Report.xlsx");
            } else {
                var url = window.URL.createObjectURL(blob);
                var a = document.createElement("a");
                document.body.appendChild(a);
                a.href = url;
                a.download = "Report.xlsx";
                a.click();
                window.URL.revokeObjectURL(url);
                document.body.removeChild(a);
            }
        })
        .catch(function(err) {
            alert(err.message || err);
            throw err;
        });
}

function convertArrayObjectToNestedArray(arrayObject) {
    return arrayObject.map(function(obj) {
        return convertObjectToArray(obj);
    });
}

function convertObjectToArray(obj) {
    return Object.keys(obj).map(function(key) {
        return obj[key];
    });
}

function setHeaderStyleAndAutoFillter(worksheet) {
    // bold header
    worksheet.range("A1:Y1").autoFilter().style("bold", true);
    // freeze panes (freeze first three column and first rows)
    worksheet.freezePanes(3, 1);
    return worksheet;
}

function setHeaderStyleAndAutoFillterTab_1(worksheet) {
    // bold header
    worksheet.range("A1:Y1").autoFilter().style("bold", true);
    // freeze panes (freeze first three column and first rows)
    const cell = worksheet[0];
    console.log("CELLL", cell);
    // cell._value = parseInt(cell._value);
    worksheet.freezePanes(3, 1);
    return worksheet;
}
// VINHNVQ - END EXPORT

function convertLstObjectToArray(lstDataRow) {
    let data = [];
    lstDataRow.forEach((value) => {
        let subData = [];
        subData.push(value[header[0]] === undefined ? "" : value[header[0]]);
        subData.push(value[header[1]] === undefined ? "" : value[header[1]]);
        subData.push(value[header[2]] === undefined ? "" : value[header[2]]);
        subData.push(value[header[3]] === undefined ? "" : value[header[3]]);
        subData.push(value[header[4]] === undefined ? "" : value[header[4]]);
        subData.push(value[header[5]] === undefined ? "" : value[header[5]]);
        subData.push(value[header[6]] === undefined ? "" : value[header[6]]);
        subData.push(value[header[7]] === undefined ? "" : value[header[7]]);
        subData.push(value[header[8]] === undefined ? "" : value[header[8]]);
        subData.push(value[header[9]] === undefined ? "" : value[header[9]]);
        subData.push(value[header[10]] === undefined ? "" : value[header[10]]);
        subData.push(value[header[11]] === undefined ? "" : value[header[11]]);
        subData.push(value[header[12]] === undefined ? "" : value[header[12]]);
        subData.push(value[header[13]] === undefined ? "" : value[header[13]]);
        subData.push(value[header[14]] === undefined ? "" : value[header[14]]);
        subData.push(value[header[15]] === undefined ? "" : value[header[15]]);
        data.push(subData);
    });
    return data;
}

function convertArrayTolstObject(arr) {
    let data = [];
    arr.forEach((row) => {
        let obj = {};
        let val = row["_aData"];
        val.forEach((cell, index) => {
            obj["" + headerVairable[index]] = val[index];
        });

        data.push(obj);
    });
    return data;
}

function convertlstUserToArray(lstDataRow) {
    let data = [];
    lstDataRow.forEach((value) => {
        let subData = [];
        subData.push(
            value[headerUser[0]] === undefined ? "" : value[headerUser[0]]
        );
        subData.push(
            value[headerUser[1]] === undefined ? "" : value[headerUser[1]]
        );
        subData.push(
            value[headerUser[2]] === undefined ? "" : value[headerUser[2]]
        );
        subData.push(
            value[headerUser[3]] === undefined ? "" : value[headerUser[3]]
        );
        subData.push(
            value[headerUser[4]] === undefined ? "" : value[headerUser[4]]
        );
        subData.push(
            value[headerUser[5]] === undefined ? "" : value[headerUser[5]]
        );
        subData.push(
            value[headerUser[6]] === undefined ? "" : value[headerUser[6]]
        );
        subData.push(
            value[headerUser[7]] === undefined ? "" : value[headerUser[7]]
        );
        data.push(subData);
    });
    return data;
}

function convertlstAnswer(lstDataRow) {
    let data = [];
    lstDataRow.forEach((value) => {
        let subData = [];
        subData.push(
            value[headerAnswer[0]] === undefined ? "" : value[headerAnswer[0]]
        );
        subData.push(
            value[headerAnswer[1]] === undefined ? "" : value[headerAnswer[1]]
        );
        subData.push(
            value[headerAnswer[2]] === undefined ? "" : value[headerAnswer[2]]
        );
        subData.push(
            value[headerAnswer[3]] === undefined ? "" : value[headerAnswer[3]]
        );
        subData.push(
            value[headerAnswer[4]] === undefined ? "" : value[headerAnswer[4]]
        );
        subData.push(
            value[headerAnswer[5]] === undefined ? "" : value[headerAnswer[5]]
        );
        subData.push(
            value[headerAnswer[6]] === undefined ? "" : value[headerAnswer[6]]
        );
        subData.push(
            value[headerAnswer[7]] === undefined ? "" : value[headerAnswer[7]]
        );
        subData.push(
            value[headerAnswer[8]] === undefined ? "" : value[headerAnswer[8]]
        );
        subData.push(
            value[headerAnswer[9]] === undefined ? "" : value[headerAnswer[9]]
        );
        subData.push(
            value[headerAnswer[10]] === undefined ? "" : value[headerAnswer[10]]
        );
        subData.push(
            value[headerAnswer[11]] === undefined ? "" : value[headerAnswer[11]]
        );
        subData.push(
            value[headerAnswer[12]] === undefined ? "" : value[headerAnswer[12]]
        );
        subData.push(
            value[headerAnswer[13]] === undefined ? "" : value[headerAnswer[13]]
        );
        subData.push(
            value[headerAnswer[14]] === undefined ? "" : value[headerAnswer[14]]
        );
        data.push(subData);
    });
    return data;
}

// add true answer to list data export, dùng chung cho tất cả
function checkDistinctTrueAnswer(
    testId,
    userId,
    listExportData,
    session_no,
    objDapAn,
    type
) {
    var objIndex;
    let user = userFilter
        .filter(
            (obj) =>
            obj["test_id"] == testId &&
            obj["user_id"] == userId &&
            obj["session_no"] == session_no
        )
        .map((obj) => obj);

    const check = listExportData
        .filter(
            (obj) =>
            obj["testId"] === testId &&
            obj["userId"] === userId &&
            obj["sessionNo"] === session_no
        )
        .map((obj) => obj);
    // console.log("LIST EXPORT DATA", listExportData)
    if (check.length == 0) {
        listExportData.push({
            testId: testId,
            userId: userId,
            sessionNo: session_no,
            listCaseIdTrue: "",
            listCaseIdFalse: "",
            percentType: type,
            percent: "",
            numberCaseTrue: 1,
            totalCase: 1,
            listAgeTrue: "",
            listAgeFalse: "",
            listCaseDensityTrue: "",
            listCaseDensityFalse: "",
            listLesionTypeTrue: "",
            listLesionTypeFalse: "",
            listLesionSideTrue: "",
            listLesionSideFalse: "",
            listLesionSiteTrue: "",
            listLesionSiteFalse: "",
            listLesionSizeTrue: "",
            listLesionSizeFalse: "",
            userAddress: user[0]["Địa chỉ"],
            userGroup: user[0]["Nhóm"],
            userTime: user[0]["Số giờ"],
            userExp: user[0]["Số năm kinh nghiệm"],
        });

        objIndex = listExportData.findIndex(
            (obj) =>
            obj.testId === testId &&
            obj.userId === userId &&
            obj.sessionNo === session_no
        );

        if (listExportData[objIndex].listAgeTrue == "") {
            listExportData[objIndex].listAgeTrue += objDapAn[0]["Tuổi"];
        } else {
            listExportData[objIndex].listAgeTrue += "," + objDapAn[0]["Tuổi"];
        }

        if (listExportData[objIndex].listCaseIdTrue == "") {
            listExportData[objIndex].listCaseIdTrue += objDapAn[0]["Case ID"];
        } else {
            listExportData[objIndex].listCaseIdTrue += "," + objDapAn[0]["Case ID"];
        }

        if (listExportData[objIndex].listCaseDensityTrue == "") {
            listExportData[objIndex].listCaseDensityTrue +=
                objDapAn[0]["Case density"];
        } else {
            listExportData[objIndex].listCaseDensityTrue +=
                "," + objDapAn[0]["Case density"];
        }

        if (listExportData[objIndex].listLesionSideTrue == "") {
            listExportData[objIndex].listLesionSideTrue += objDapAn[0]["Lesion side"];
        } else {
            listExportData[objIndex].listLesionSideTrue +=
                "," + objDapAn[0]["Lesion side"];
        }

        if (listExportData[objIndex].listLesionSiteTrue == "") {
            listExportData[objIndex].listLesionSiteTrue += objDapAn[0]["Lesion site"];
        } else {
            listExportData[objIndex].listLesionSiteTrue +=
                "," + objDapAn[0]["Lesion site"];
        }

        if (listExportData[objIndex].listLesionSizeTrue == "") {
            listExportData[objIndex].listLesionSizeTrue +=
                objDapAn[0]["Lesion size (mm)"];
        } else {
            listExportData[objIndex].listLesionSizeTrue +=
                "," + objDapAn[0]["Lesion size (mm)"];
        }

        if (type != "Normal") {
            if (listExportData[objIndex].listLesionTypeTrue == "") {
                listExportData[objIndex].listLesionTypeTrue +=
                    objDapAn[0]["Lesion type"];
            } else {
                listExportData[objIndex].listLesionTypeTrue +=
                    "," + objDapAn[0]["Lesion type"];
            }
        }

        if (isCaseDensity == true && isLessionType == false) {
            listExportData[objIndex].percentType += " (Compare with Case Density)";
        } else if (isCaseDensity == false && isLessionType == true) {
            listExportData[objIndex].percentType += " (Compare with Lesion Type)";
        } else if (isCaseDensity == true && isLessionType == true) {
            listExportData[objIndex].percentType +=
                " (Compare with Case Density and Lesion Type)";
        }
        listExportData[objIndex].percent =
            (
                (listExportData[objIndex].numberCaseTrue /
                    listExportData[objIndex].totalCase) *
                100
            ).toFixed(2) + "%";
    } else {
        objIndex = listExportData.findIndex(
            (obj) =>
            obj.testId === testId &&
            obj.userId === userId &&
            obj.sessionNo === session_no
        );
        listExportData[objIndex].numberCaseTrue++;
        listExportData[objIndex].totalCase++;
        listExportData[objIndex].percent =
            (
                (listExportData[objIndex].numberCaseTrue /
                    listExportData[objIndex].totalCase) *
                100
            ).toFixed(2) + "%";

        if (listExportData[objIndex].listAgeTrue == "") {
            listExportData[objIndex].listAgeTrue += objDapAn[0]["Tuổi"];
        } else {
            listExportData[objIndex].listAgeTrue += "," + objDapAn[0]["Tuổi"];
        }

        if (listExportData[objIndex].listCaseIdTrue == "") {
            listExportData[objIndex].listCaseIdTrue += objDapAn[0]["Case ID"];
        } else {
            listExportData[objIndex].listCaseIdTrue += "," + objDapAn[0]["Case ID"];
        }

        if (listExportData[objIndex].listCaseDensityTrue == "") {
            listExportData[objIndex].listCaseDensityTrue +=
                objDapAn[0]["Case density"];
        } else {
            listExportData[objIndex].listCaseDensityTrue +=
                "," + objDapAn[0]["Case density"];
        }

        if (listExportData[objIndex].listLesionSideTrue == "") {
            listExportData[objIndex].listLesionSideTrue += objDapAn[0]["Lesion side"];
        } else {
            listExportData[objIndex].listLesionSideTrue +=
                "," + objDapAn[0]["Lesion side"];
        }

        if (listExportData[objIndex].listLesionSiteTrue == "") {
            listExportData[objIndex].listLesionSiteTrue += objDapAn[0]["Lesion site"];
        } else {
            listExportData[objIndex].listLesionSiteTrue +=
                "," + objDapAn[0]["Lesion site"];
        }

        if (listExportData[objIndex].listLesionSizeTrue == "") {
            listExportData[objIndex].listLesionSizeTrue +=
                objDapAn[0]["Lesion size (mm)"];
        } else {
            listExportData[objIndex].listLesionSizeTrue +=
                "," + objDapAn[0]["Lesion size (mm)"];
        }

        if (type != "Normal") {
            if (listExportData[objIndex].listLesionTypeTrue == "") {
                listExportData[objIndex].listLesionTypeTrue +=
                    objDapAn[0]["Lesion type"];
            } else {
                listExportData[objIndex].listLesionTypeTrue +=
                    "," + objDapAn[0]["Lesion type"];
            }
        }
    }
}

// add false answer to list data export, dùng chung cho tất cả
function checkDistinctTotalAnswer(
    testId,
    userId,
    listExportData,
    session_no,
    objDapAn,
    type
) {
    var objIndex;
    let user = userFilter
        .filter(
            (obj) =>
            obj["test_id"] == testId &&
            obj["user_id"] == userId &&
            obj["session_no"] == session_no
        )
        .map((obj) => obj);

    const check = listExportData
        .filter(
            (obj) =>
            obj["testId"] === testId &&
            obj["userId"] === userId &&
            obj["sessionNo"] === session_no
        )
        .map((obj) => obj);
    if (check.length == 0) {
        listExportData.push({
            testId: testId,
            userId: userId,
            sessionNo: session_no,
            listCaseIdTrue: "",
            listCaseIdFalse: "",
            percentType: type,
            percent: "",
            numberCaseTrue: 0,
            totalCase: 1,
            listAgeTrue: "",
            listAgeFalse: "",
            listCaseDensityTrue: "",
            listCaseDensityFalse: "",
            listLesionTypeTrue: "",
            listLesionTypeFalse: "",
            listLesionSideTrue: "",
            listLesionSideFalse: "",
            listLesionSiteTrue: "",
            listLesionSiteFalse: "",
            listLesionSizeTrue: "",
            listLesionSizeFalse: "",
            userAddress: user[0]["Địa chỉ"],
            userGroup: user[0]["Nhóm"],
            userTime: user[0]["Số giờ"],
            userExp: user[0]["Số năm kinh nghiệm"],
        });

        objIndex = listExportData.findIndex(
            (obj) =>
            obj.testId == testId &&
            obj.userId == userId &&
            obj.sessionNo === session_no
        );

        if (listExportData[objIndex].listAgeFalse == "") {
            listExportData[objIndex].listAgeFalse += objDapAn[0]["Tuổi"];
        } else {
            listExportData[objIndex].listAgeFalse += "," + objDapAn[0]["Tuổi"];
        }

        if (listExportData[objIndex].listCaseIdFalse == "") {
            listExportData[objIndex].listCaseIdFalse += objDapAn[0]["Case ID"];
        } else {
            listExportData[objIndex].listCaseIdFalse += "," + objDapAn[0]["Case ID"];
        }

        if (listExportData[objIndex].listCaseDensityFalse == "") {
            listExportData[objIndex].listCaseDensityFalse +=
                objDapAn[0]["Case density"];
        } else {
            listExportData[objIndex].listCaseDensityFalse +=
                "," + objDapAn[0]["Case density"];
        }

        if (listExportData[objIndex].listLesionSideFalse == "") {
            listExportData[objIndex].listLesionSideFalse +=
                objDapAn[0]["Lesion side"];
        } else {
            listExportData[objIndex].listLesionSideFalse +=
                "," + objDapAn[0]["Lesion side"];
        }

        if (listExportData[objIndex].listLesionSiteFalse == "") {
            listExportData[objIndex].listLesionSiteFalse +=
                objDapAn[0]["Lesion site"];
        } else {
            listExportData[objIndex].listLesionSiteFalse +=
                "," + objDapAn[0]["Lesion site"];
        }

        if (listExportData[objIndex].listLesionSizeFalse == "") {
            listExportData[objIndex].listLesionSizeFalse +=
                objDapAn[0]["Lesion size (mm)"];
        } else {
            listExportData[objIndex].listLesionSizeFalse +=
                "," + objDapAn[0]["Lesion size (mm)"];
        }

        if (type != "Normal") {
            if (listExportData[objIndex].listLesionTypeFalse == "") {
                listExportData[objIndex].listLesionTypeFalse +=
                    objDapAn[0]["Lesion type"];
            } else {
                listExportData[objIndex].listLesionTypeFalse +=
                    "," + objDapAn[0]["Lesion type"];
            }
        }

        if (isCaseDensity == true && isLessionType == false) {
            listExportData[objIndex].percentType += " (Compare with Case Density)";
        } else if (isCaseDensity == false && isLessionType == true) {
            listExportData[objIndex].percentType += " (Compare with Lesion Type)";
        } else if (isCaseDensity == true && isLessionType == true) {
            listExportData[objIndex].percentType +=
                " (Compare with Case Density and Lesion Type)";
        }
        listExportData[objIndex].percent =
            (
                (listExportData[objIndex].numberCaseTrue /
                    listExportData[objIndex].totalCase) *
                100
            ).toFixed(2) + "%";
    } else {
        objIndex = listExportData.findIndex(
            (obj) =>
            obj.testId == testId &&
            obj.userId == userId &&
            obj.sessionNo === session_no
        );
        listExportData[objIndex].totalCase++;
        listExportData[objIndex].percent =
            (
                (listExportData[objIndex].numberCaseTrue /
                    listExportData[objIndex].totalCase) *
                100
            ).toFixed(2) + "%";
        if (listExportData[objIndex].listAgeFalse == "") {
            listExportData[objIndex].listAgeFalse += objDapAn[0]["Tuổi"];
        } else {
            listExportData[objIndex].listAgeFalse += "," + objDapAn[0]["Tuổi"];
        }

        if (listExportData[objIndex].listCaseIdFalse == "") {
            listExportData[objIndex].listCaseIdFalse += objDapAn[0]["Case ID"];
        } else {
            listExportData[objIndex].listCaseIdFalse += "," + objDapAn[0]["Case ID"];
        }

        if (listExportData[objIndex].listCaseDensityFalse == "") {
            listExportData[objIndex].listCaseDensityFalse +=
                objDapAn[0]["Case density"];
        } else {
            listExportData[objIndex].listCaseDensityFalse +=
                "," + objDapAn[0]["Case density"];
        }

        if (listExportData[objIndex].listLesionSideFalse == "") {
            listExportData[objIndex].listLesionSideFalse +=
                objDapAn[0]["Lesion side"];
        } else {
            listExportData[objIndex].listLesionSideFalse +=
                "," + objDapAn[0]["Lesion side"];
        }

        if (listExportData[objIndex].listLesionSiteFalse == "") {
            listExportData[objIndex].listLesionSiteFalse +=
                objDapAn[0]["Lesion site"];
        } else {
            listExportData[objIndex].listLesionSiteFalse +=
                "," + objDapAn[0]["Lesion site"];
        }

        if (listExportData[objIndex].listLesionSizeFalse == "") {
            listExportData[objIndex].listLesionSizeFalse +=
                objDapAn[0]["Lesion size (mm)"];
        } else {
            listExportData[objIndex].listLesionSizeFalse +=
                "," + objDapAn[0]["Lesion size (mm)"];
        }
        if (type != "Normal") {
            if (listExportData[objIndex].listLesionTypeFalse == "") {
                listExportData[objIndex].listLesionTypeFalse +=
                    objDapAn[0]["Lesion type"];
            } else {
                listExportData[objIndex].listLesionTypeFalse +=
                    "," + objDapAn[0]["Lesion type"];
            }
        }
    }
}

function checkDistinctSymmetric(
    testId,
    userId,
    listExportData,
    session_no,
    case_true,
    total_case,
    objDapAn,
    type,
    listSysTrue,
    listSysFalse
) {
    let user = userFilter
        .filter(
            (obj) =>
            obj["test_id"] == testId &&
            obj["user_id"] == userId &&
            obj["session_no"] == session_no
        )
        .map((obj) => obj);

    const check = listExportData
        .filter(
            (obj) =>
            obj["testId"] === testId &&
            obj["userId"] === userId &&
            obj["sessionNo"] === session_no
        )
        .map((obj) => obj);
    if (check.length == 0) {
        listExportData.push({
            testId: testId,
            userId: userId,
            sessionNo: session_no,
            listCaseIdTrue: "",
            listCaseIdFalse: "",
            percentType: type,
            percent: "",
            numberCaseTrue: case_true,
            totalCase: total_case,
            listAgeTrue: "",
            listAgeFalse: "",
            listCaseDensityTrue: "",
            listCaseDensityFalse: "",
            listLesionTypeTrue: "",
            listLesionTypeFalse: "",
            listLesionSideTrue: "",
            listLesionSideFalse: "",
            listLesionSiteTrue: "",
            listLesionSiteFalse: "",
            listLesionSizeTrue: "",
            listLesionSizeFalse: "",
            userAddress: user[0]["Địa chỉ"],
            userGroup: user[0]["Nhóm"],
            userTime: user[0]["Số giờ"],
            userExp: user[0]["Số năm kinh nghiệm"],
        });
        objIndex = listExportData.findIndex(
            (obj) =>
            obj.testId === testId &&
            obj.userId === userId &&
            obj.sessionNo === session_no
        );

        if (listSysTrue.length !== 0) {
            for (var i = 0; i < listSysTrue.length; i++) {
                if (listSysTrue[i].arrayTrue.length !== 0) {
                    for (var k = 0; k < listSysTrue[i].arrayTrue.length; k++) {
                        if (listExportData[objIndex].listAgeTrue == "") {
                            listExportData[objIndex].listAgeTrue +=
                                listSysTrue[i].arrayTrue[k]["Tuổi"];
                        } else {
                            listExportData[objIndex].listAgeTrue +=
                                "," + listSysTrue[i].arrayTrue[k]["Tuổi"];
                        }
                    }
                }
            }
        }

        if (listSysTrue.length !== 0) {
            for (var i = 0; i < listSysTrue.length; i++) {
                if (listExportData[objIndex].listCaseIdTrue == "") {
                    listExportData[objIndex].listCaseIdTrue +=
                        listSysTrue[i].arrayTrue[0]["Case ID"];
                } else {
                    listExportData[objIndex].listCaseIdTrue +=
                        "," + listSysTrue[i].arrayTrue[0]["Case ID"];
                }
            }
        }

        if (listSysTrue.length !== 0) {
            for (var i = 0; i < listSysTrue.length; i++) {
                if (listSysTrue[i].arrayTrue.length !== 0) {
                    for (var k = 0; k < listSysTrue[i].arrayTrue.length; k++) {
                        if (listExportData[objIndex].listCaseDensityTrue == "") {
                            listExportData[objIndex].listCaseDensityTrue +=
                                listSysTrue[i].arrayTrue[k]["Case density"];
                        } else {
                            listExportData[objIndex].listCaseDensityTrue +=
                                "," + listSysTrue[i].arrayTrue[k]["Case density"];
                        }
                    }
                }
            }
        }

        if (listSysTrue.length !== 0) {
            for (var i = 0; i < listSysTrue.length; i++) {
                if (listSysTrue[i].arrayTrue.length !== 0) {
                    for (var k = 0; k < listSysTrue[i].arrayTrue.length; k++) {
                        if (listExportData[objIndex].listLesionSideTrue == "") {
                            listExportData[objIndex].listLesionSideTrue +=
                                listSysTrue[i].arrayTrue[k]["Lesion side"];
                        } else {
                            listExportData[objIndex].listLesionSideTrue +=
                                "," + listSysTrue[i].arrayTrue[k]["Lesion side"];
                        }
                    }
                }
            }
        }

        if (listSysTrue.length !== 0) {
            for (var i = 0; i < listSysTrue.length; i++) {
                if (listSysTrue[i].arrayTrue.length !== 0) {
                    for (var k = 0; k < listSysTrue[i].arrayTrue.length; k++) {
                        if (listExportData[objIndex].listLesionSiteTrue == "") {
                            listExportData[objIndex].listLesionSiteTrue +=
                                listSysTrue[i].arrayTrue[k]["Lesion site"];
                        } else {
                            listExportData[objIndex].listLesionSiteTrue +=
                                "," + listSysTrue[i].arrayTrue[k]["Lesion site"];
                        }
                    }
                }
            }
        }

        if (listSysTrue.length !== 0) {
            for (var i = 0; i < listSysTrue.length; i++) {
                if (listSysTrue[i].arrayTrue.length !== 0) {
                    for (var k = 0; k < listSysTrue[i].arrayTrue.length; k++) {
                        if (listExportData[objIndex].listLesionSizeTrue == "") {
                            listExportData[objIndex].listLesionSizeTrue +=
                                listSysTrue[i].arrayTrue[k]["Lesion size (mm)"];
                        } else {
                            listExportData[objIndex].listLesionSizeTrue +=
                                "," + listSysTrue[i].arrayTrue[k]["Lesion size (mm)"];
                        }
                    }
                }
            }
        }

        if (listSysTrue.length !== 0) {
            for (var i = 0; i < listSysTrue.length; i++) {
                if (listSysTrue[i].arrayTrue.length !== 0) {
                    for (var k = 0; k < listSysTrue[i].arrayTrue.length; k++) {
                        if (listExportData[objIndex].listLesionTypeTrue == "") {
                            listExportData[objIndex].listLesionTypeTrue +=
                                listSysTrue[i].arrayTrue[k]["Lesion type"];
                        } else {
                            listExportData[objIndex].listLesionTypeTrue +=
                                "," + listSysTrue[i].arrayTrue[k]["Lesion type"];
                        }
                    }
                }
            }
        }

        if (listSysFalse.length !== 0) {
            for (var i = 0; i < listSysFalse.length; i++) {
                if (listSysFalse[i].arrayFalse.length !== 0) {
                    for (var k = 0; k < listSysFalse[i].arrayFalse.length; k++) {
                        if (listExportData[objIndex].listAgeFalse == "") {
                            listExportData[objIndex].listAgeFalse +=
                                listSysFalse[i].arrayFalse[k]["Tuổi"];
                        } else {
                            listExportData[objIndex].listAgeFalse +=
                                "," + listSysFalse[i].arrayFalse[k]["Tuổi"];
                        }
                    }
                }
            }
        }

        if (listSysFalse.length !== 0) {
            for (var i = 0; i < listSysFalse.length; i++) {
                if (listSysFalse[i].arrayFalse.length !== 0) {
                    for (var k = 0; k < listSysFalse[i].arrayFalse.length; k++) {
                        if (listExportData[objIndex].listCaseIdFalse == "") {
                            listExportData[objIndex].listCaseIdFalse +=
                                listSysFalse[i].arrayFalse[k]["Case ID"];
                        } else {
                            listExportData[objIndex].listCaseIdFalse +=
                                "," + listSysFalse[i].arrayFalse[k]["Case ID"];
                        }
                    }
                }
            }
        }

        if (listSysFalse.length !== 0) {
            for (var i = 0; i < listSysFalse.length; i++) {
                if (listSysFalse[i].arrayFalse.length !== 0) {
                    for (var k = 0; k < listSysFalse[i].arrayFalse.length; k++) {
                        if (listExportData[objIndex].listCaseDensityFalse == "") {
                            listExportData[objIndex].listCaseDensityFalse +=
                                listSysFalse[i].arrayFalse[k]["Case density"];
                        } else {
                            listExportData[objIndex].listCaseDensityFalse +=
                                "," + listSysFalse[i].arrayFalse[k]["Case density"];
                        }
                    }
                }
            }
        }

        if (listSysFalse.length !== 0) {
            for (var i = 0; i < listSysFalse.length; i++) {
                if (listSysFalse[i].arrayFalse.length !== 0) {
                    for (var k = 0; k < listSysFalse[i].arrayFalse.length; k++) {
                        if (listExportData[objIndex].listLesionSideFalse == "") {
                            listExportData[objIndex].listLesionSideFalse +=
                                listSysFalse[i].arrayFalse[k]["Lesion side"];
                        } else {
                            listExportData[objIndex].listLesionSideFalse +=
                                "," + listSysFalse[i].arrayFalse[k]["Lesion side"];
                        }
                    }
                }
            }
        }

        if (listSysFalse.length !== 0) {
            for (var i = 0; i < listSysFalse.length; i++) {
                if (listSysFalse[i].arrayFalse.length !== 0) {
                    for (var k = 0; k < listSysFalse[i].arrayFalse.length; k++) {
                        if (listExportData[objIndex].listLesionSiteFalse == "") {
                            listExportData[objIndex].listLesionSiteFalse +=
                                listSysFalse[i].arrayFalse[k]["Lesion site"];
                        } else {
                            listExportData[objIndex].listLesionSiteFalse +=
                                "," + listSysFalse[i].arrayFalse[k]["Lesion site"];
                        }
                    }
                }
            }
        }

        if (listSysFalse.length !== 0) {
            for (var i = 0; i < listSysFalse.length; i++) {
                if (listSysFalse[i].arrayFalse.length !== 0) {
                    for (var k = 0; k < listSysFalse[i].arrayFalse.length; k++) {
                        if (listExportData[objIndex].listLesionSizeFalse == "") {
                            listExportData[objIndex].listLesionSizeFalse +=
                                listSysFalse[i].arrayFalse[k]["Lesion size (mm)"];
                        } else {
                            listExportData[objIndex].listLesionSizeFalse +=
                                "," + listSysFalse[i].arrayFalse[k]["Lesion size (mm)"];
                        }
                    }
                }
            }
        }

        if (listSysFalse.length !== 0) {
            for (var i = 0; i < listSysFalse.length; i++) {
                if (listSysFalse[i].arrayFalse.length !== 0) {
                    for (var k = 0; k < listSysFalse[i].arrayFalse.length; k++) {
                        if (listExportData[objIndex].listLesionTypeFalse == "") {
                            listExportData[objIndex].listLesionTypeFalse +=
                                listSysFalse[i].arrayFalse[k]["Lesion type"];
                        } else {
                            listExportData[objIndex].listLesionTypeFalse +=
                                "," + listSysFalse[i].arrayFalse[k]["Lesion type"];
                        }
                    }
                }
            }
        }

        if (isCaseDensity == true && isLessionType == false) {
            listExportData[objIndex].percentType += " (Compare with Case Density)";
        } else if (isCaseDensity == false && isLessionType == true) {
            listExportData[objIndex].percentType += " (Compare with Lesion Type)";
        } else if (isCaseDensity == true && isLessionType == true) {
            listExportData[objIndex].percentType +=
                " (Compare with Case Density and Lesion Type)";
        }
        listExportData[objIndex].percent =
            (
                (listExportData[objIndex].numberCaseTrue /
                    listExportData[objIndex].totalCase) *
                100
            ).toFixed(2) + "%";
    } else {
        objIndex = listExportData.findIndex(
            (obj) =>
            obj.testId === testId &&
            obj.userId === userId &&
            obj.sessionNo === session_no
        );
        listExportData[objIndex].numberCaseTrue += case_true;
        listExportData[objIndex].totalCase += total_case;

        if (listSysTrue.length !== 0) {
            for (var i = 0; i < listSysTrue.length; i++) {
                if (listExportData[objIndex].listCaseIdTrue == "") {
                    listExportData[objIndex].listCaseIdTrue +=
                        listSysTrue[i].arrayTrue[0]["Case ID"];
                } else {
                    listExportData[objIndex].listCaseIdTrue +=
                        "," + listSysTrue[i].arrayTrue[0]["Case ID"];
                }
            }
        }
        if (listSysFalse.length !== 0) {
            for (var i = 0; i < listSysFalse.length; i++) {
                if (listSysFalse[i].arrayFalse.length !== 0) {
                    for (var k = 0; k < listSysFalse[i].arrayFalse.length; k++) {
                        if (listExportData[objIndex].listCaseIdFalse == "") {
                            listExportData[objIndex].listCaseIdFalse +=
                                listSysFalse[i].arrayFalse[k]["Case ID"];
                        } else {
                            listExportData[objIndex].listCaseIdFalse +=
                                "," + listSysFalse[i].arrayFalse[k]["Case ID"];
                        }
                    }
                }
            }
        }
        if (listSysTrue.length !== 0) {
            for (var i = 0; i < listSysTrue.length; i++) {
                if (listSysTrue[i].arrayTrue.length !== 0) {
                    for (var k = 0; k < listSysTrue[i].arrayTrue.length; k++) {
                        if (listExportData[objIndex].listAgeTrue == "") {
                            listExportData[objIndex].listAgeTrue +=
                                listSysTrue[i].arrayTrue[k]["Tuổi"];
                        } else {
                            listExportData[objIndex].listAgeTrue +=
                                "," + listSysTrue[i].arrayTrue[k]["Tuổi"];
                        }
                    }
                }
            }
        }

        if (listSysTrue.length !== 0) {
            for (var i = 0; i < listSysTrue.length; i++) {
                if (listSysTrue[i].arrayTrue.length !== 0) {
                    for (var k = 0; k < listSysTrue[i].arrayTrue.length; k++) {
                        if (listExportData[objIndex].listCaseDensityTrue == "") {
                            listExportData[objIndex].listCaseDensityTrue +=
                                listSysTrue[i].arrayTrue[k]["Case density"];
                        } else {
                            listExportData[objIndex].listCaseDensityTrue +=
                                "," + listSysTrue[i].arrayTrue[k]["Case density"];
                        }
                    }
                }
            }
        }

        if (listSysTrue.length !== 0) {
            for (var i = 0; i < listSysTrue.length; i++) {
                if (listSysTrue[i].arrayTrue.length !== 0) {
                    for (var k = 0; k < listSysTrue[i].arrayTrue.length; k++) {
                        if (listExportData[objIndex].listLesionSideTrue == "") {
                            listExportData[objIndex].listLesionSideTrue +=
                                listSysTrue[i].arrayTrue[k]["Lesion side"];
                        } else {
                            listExportData[objIndex].listLesionSideTrue +=
                                "," + listSysTrue[i].arrayTrue[k]["Lesion side"];
                        }
                    }
                }
            }
        }

        if (listSysTrue.length !== 0) {
            for (var i = 0; i < listSysTrue.length; i++) {
                if (listSysTrue[i].arrayTrue.length !== 0) {
                    for (var k = 0; k < listSysTrue[i].arrayTrue.length; k++) {
                        if (listExportData[objIndex].listLesionSiteTrue == "") {
                            listExportData[objIndex].listLesionSiteTrue +=
                                listSysTrue[i].arrayTrue[k]["Lesion site"];
                        } else {
                            listExportData[objIndex].listLesionSiteTrue +=
                                "," + listSysTrue[i].arrayTrue[k]["Lesion site"];
                        }
                    }
                }
            }
        }

        if (listSysTrue.length !== 0) {
            for (var i = 0; i < listSysTrue.length; i++) {
                if (listSysTrue[i].arrayTrue.length !== 0) {
                    for (var k = 0; k < listSysTrue[i].arrayTrue.length; k++) {
                        if (listExportData[objIndex].listLesionSizeTrue == "") {
                            listExportData[objIndex].listLesionSizeTrue +=
                                listSysTrue[i].arrayTrue[k]["Lesion size (mm)"];
                        } else {
                            listExportData[objIndex].listLesionSizeTrue +=
                                "," + listSysTrue[i].arrayTrue[k]["Lesion size (mm)"];
                        }
                    }
                }
            }
        }

        if (listSysTrue.length !== 0) {
            for (var i = 0; i < listSysTrue.length; i++) {
                if (listSysTrue[i].arrayTrue.length !== 0) {
                    for (var k = 0; k < listSysTrue[i].arrayTrue.length; k++) {
                        if (listExportData[objIndex].listLesionTypeTrue == "") {
                            listExportData[objIndex].listLesionTypeTrue +=
                                listSysTrue[i].arrayTrue[k]["Lesion type"];
                        } else {
                            listExportData[objIndex].listLesionTypeTrue +=
                                "," + listSysTrue[i].arrayTrue[k]["Lesion type"];
                        }
                    }
                }
            }
        }

        if (listSysFalse.length !== 0) {
            for (var i = 0; i < listSysFalse.length; i++) {
                if (listSysFalse[i].arrayFalse.length !== 0) {
                    for (var k = 0; k < listSysFalse[i].arrayFalse.length; k++) {
                        if (listExportData[objIndex].listAgeFalse == "") {
                            listExportData[objIndex].listAgeFalse +=
                                listSysFalse[i].arrayFalse[k]["Tuổi"];
                        } else {
                            listExportData[objIndex].listAgeFalse +=
                                "," + listSysFalse[i].arrayFalse[k]["Tuổi"];
                        }
                    }
                }
            }
        }

        if (listSysFalse.length !== 0) {
            for (var i = 0; i < listSysFalse.length; i++) {
                if (listSysFalse[i].arrayFalse.length !== 0) {
                    for (var k = 0; k < listSysFalse[i].arrayFalse.length; k++) {
                        if (listExportData[objIndex].listCaseDensityFalse == "") {
                            listExportData[objIndex].listCaseDensityFalse +=
                                listSysFalse[i].arrayFalse[k]["Case density"];
                        } else {
                            listExportData[objIndex].listCaseDensityFalse +=
                                "," + listSysFalse[i].arrayFalse[k]["Case density"];
                        }
                    }
                }
            }
        }

        if (listSysFalse.length !== 0) {
            for (var i = 0; i < listSysFalse.length; i++) {
                if (listSysFalse[i].arrayFalse.length !== 0) {
                    for (var k = 0; k < listSysFalse[i].arrayFalse.length; k++) {
                        if (listExportData[objIndex].listLesionSideFalse == "") {
                            listExportData[objIndex].listLesionSideFalse +=
                                listSysFalse[i].arrayFalse[k]["Lesion side"];
                        } else {
                            listExportData[objIndex].listLesionSideFalse +=
                                "," + listSysFalse[i].arrayFalse[k]["Lesion side"];
                        }
                    }
                }
            }
        }

        if (listSysFalse.length !== 0) {
            for (var i = 0; i < listSysFalse.length; i++) {
                if (listSysFalse[i].arrayFalse.length !== 0) {
                    for (var k = 0; k < listSysFalse[i].arrayFalse.length; k++) {
                        if (listExportData[objIndex].listLesionSiteFalse == "") {
                            listExportData[objIndex].listLesionSiteFalse +=
                                listSysFalse[i].arrayFalse[k]["Lesion site"];
                        } else {
                            listExportData[objIndex].listLesionSiteFalse +=
                                "," + listSysFalse[i].arrayFalse[k]["Lesion site"];
                        }
                    }
                }
            }
        }

        if (listSysFalse.length !== 0) {
            for (var i = 0; i < listSysFalse.length; i++) {
                if (listSysFalse[i].arrayFalse.length !== 0) {
                    for (var k = 0; k < listSysFalse[i].arrayFalse.length; k++) {
                        if (listExportData[objIndex].listLesionSizeFalse == "") {
                            listExportData[objIndex].listLesionSizeFalse +=
                                listSysFalse[i].arrayFalse[k]["Lesion size (mm)"];
                        } else {
                            listExportData[objIndex].listLesionSizeFalse +=
                                "," + listSysFalse[i].arrayFalse[k]["Lesion size (mm)"];
                        }
                    }
                }
            }
        }

        if (listSysFalse.length !== 0) {
            for (var i = 0; i < listSysFalse.length; i++) {
                if (listSysFalse[i].arrayFalse.length !== 0) {
                    for (var k = 0; k < listSysFalse[i].arrayFalse.length; k++) {
                        if (listExportData[objIndex].listLesionTypeFalse == "") {
                            listExportData[objIndex].listLesionTypeFalse +=
                                listSysFalse[i].arrayFalse[k]["Lesion type"];
                        } else {
                            listExportData[objIndex].listLesionTypeFalse +=
                                "," + listSysFalse[i].arrayFalse[k]["Lesion type"];
                        }
                    }
                }
            }
        }

        listExportData[objIndex].percent =
            (
                (listExportData[objIndex].numberCaseTrue /
                    listExportData[objIndex].totalCase) *
                100
            ).toFixed(2) + "%";
    }
}

function checkDistinctNonSymmetric1(
    testId,
    userId,
    listExportData,
    session_no,
    case_true,
    total_case,
    objDapAn,
    type,
    listSysTrue,
    listSysFalse
) {
    // console.log("LISSS FALSEEE", listSysFalse)
    let user = userFilter
        .filter(
            (obj) =>
            obj["test_id"] == testId &&
            obj["user_id"] == userId &&
            obj["session_no"] == session_no
        )
        .map((obj) => obj);
    const check = listExportData
        .filter(
            (obj) =>
            obj["testId"] === testId &&
            obj["userId"] === userId &&
            obj["sessionNo"] === session_no
        )
        .map((obj) => obj);
    var checkLesion = [];
    var checkLesionFalse = [];
    if (check.length == 0) {
        listExportData.push({
            testId: testId,
            userId: userId,
            sessionNo: session_no,
            listCaseIdTrue: "",
            listCaseIdFalse: "",
            percentType: type,
            percent: "",
            numberCaseTrue: case_true,
            totalCase: total_case,
            listAgeTrue: "",
            listAgeFalse: "",
            listCaseDensityTrue: "",
            listCaseDensityFalse: "",
            listLesionTypeTrue: "",
            listLesionTypeFalse: "",
            listLesionSideTrue: "",
            listLesionSideFalse: "",
            listLesionSiteTrue: "",
            listLesionSiteFalse: "",
            listLesionSizeTrue: "",
            listLesionSizeFalse: "",
            userAddress: user[0]["Địa chỉ"],
            userGroup: user[0]["Nhóm"],
            userTime: user[0]["Số giờ"],
            userExp: user[0]["Số năm kinh nghiệm"],
        });
        objIndex = listExportData.findIndex(
            (obj) =>
            obj.testId === testId &&
            obj.userId === userId &&
            obj.sessionNo === session_no
        );

        if (listSysTrue.length !== 0) {
            for (var i = 0; i < listSysTrue.length; i++) {
                if (listSysTrue[i].arrayTrue.length !== 0) {
                    for (var k = 0; k < listSysTrue[i].arrayTrue.length; k++) {
                        objIndexLesion = checkLesion.findIndex(
                            (obj) => obj === listSysTrue[i].arrayTrue[k]["Lesion ID"]
                        );
                        if (objIndexLesion == -1) {
                            checkLesion.push(listSysTrue[i].arrayTrue[k]["Lesion ID"] + "");
                            // console.log("CHECKLESION", checkLesion)
                            if (listExportData[objIndex].listAgeTrue == "") {
                                listExportData[objIndex].listAgeTrue +=
                                    listSysTrue[i].arrayTrue[k]["Tuổi"];
                            } else {
                                listExportData[objIndex].listAgeTrue +=
                                    "," + listSysTrue[i].arrayTrue[k]["Tuổi"];
                            }

                            if (listExportData[objIndex].listCaseDensityTrue == "") {
                                listExportData[objIndex].listCaseDensityTrue +=
                                    listSysTrue[i].arrayTrue[k]["Case density"];
                            } else {
                                listExportData[objIndex].listCaseDensityTrue +=
                                    "," + listSysTrue[i].arrayTrue[k]["Case density"];
                            }

                            if (listExportData[objIndex].listLesionSideTrue == "") {
                                listExportData[objIndex].listLesionSideTrue +=
                                    listSysTrue[i].arrayTrue[k]["Lesion side"];
                            } else {
                                listExportData[objIndex].listLesionSideTrue +=
                                    "," + listSysTrue[i].arrayTrue[k]["Lesion side"];
                            }

                            if (listExportData[objIndex].listLesionSiteTrue == "") {
                                listExportData[objIndex].listLesionSiteTrue +=
                                    listSysTrue[i].arrayTrue[k]["Lesion site"];
                            } else {
                                listExportData[objIndex].listLesionSiteTrue +=
                                    "," + listSysTrue[i].arrayTrue[k]["Lesion site"];
                            }

                            if (listExportData[objIndex].listLesionSizeTrue == "") {
                                listExportData[objIndex].listLesionSizeTrue +=
                                    listSysTrue[i].arrayTrue[k]["Lesion size (mm)"];
                            } else {
                                listExportData[objIndex].listLesionSizeTrue +=
                                    "," + listSysTrue[i].arrayTrue[k]["Lesion size (mm)"];
                            }

                            if (listExportData[objIndex].listLesionTypeTrue == "") {
                                listExportData[objIndex].listLesionTypeTrue +=
                                    listSysTrue[i].arrayTrue[k]["Lesion type"];
                            } else {
                                listExportData[objIndex].listLesionTypeTrue +=
                                    "," + listSysTrue[i].arrayTrue[k]["Lesion type"];
                            }
                        }
                    }
                }
            }
        }

        if (listSysTrue.length !== 0) {
            for (var i = 0; i < listSysTrue.length; i++) {
                if (listExportData[objIndex].listCaseIdTrue == "") {
                    listExportData[objIndex].listCaseIdTrue +=
                        listSysTrue[i].arrayTrue[0]["Case ID"];
                } else {
                    listExportData[objIndex].listCaseIdTrue +=
                        "," + listSysTrue[i].arrayTrue[0]["Case ID"];
                }
            }
        }

        if (listSysFalse.length !== 0) {
            for (var i = 0; i < listSysFalse.length; i++) {
                if (listSysFalse[i].arrayFalse.length !== 0) {
                    for (var k = 0; k < listSysFalse[i].arrayFalse.length; k++) {
                        objIndexLesionFalse = checkLesionFalse.findIndex(
                            (obj) => obj === listSysFalse[i].arrayFalse[k]["Lesion ID"]
                        );
                        if (objIndexLesionFalse == -1) {
                            checkLesionFalse.push(
                                listSysFalse[i].arrayFalse[k]["Lesion ID"] + ""
                            );
                            if (listExportData[objIndex].listCaseIdFalse == "") {
                                listExportData[objIndex].listCaseIdFalse +=
                                    listSysFalse[i].arrayFalse[k]["Case ID"];
                            } else {
                                listExportData[objIndex].listCaseIdFalse +=
                                    "," + listSysFalse[i].arrayFalse[k]["Case ID"];
                            }

                            if (listExportData[objIndex].listAgeFalse == "") {
                                listExportData[objIndex].listAgeFalse +=
                                    listSysFalse[i].arrayFalse[k]["Tuổi"];
                            } else {
                                listExportData[objIndex].listAgeFalse +=
                                    "," + listSysFalse[i].arrayFalse[k]["Tuổi"];
                            }

                            if (listExportData[objIndex].listCaseDensityFalse == "") {
                                listExportData[objIndex].listCaseDensityFalse +=
                                    listSysFalse[i].arrayFalse[k]["Case density"];
                            } else {
                                listExportData[objIndex].listCaseDensityFalse +=
                                    "," + listSysFalse[i].arrayFalse[k]["Case density"];
                            }

                            if (listExportData[objIndex].listLesionSideFalse == "") {
                                listExportData[objIndex].listLesionSideFalse +=
                                    listSysFalse[i].arrayFalse[k]["Lesion side"];
                            } else {
                                listExportData[objIndex].listLesionSideFalse +=
                                    "," + listSysFalse[i].arrayFalse[k]["Lesion side"];
                            }

                            if (listExportData[objIndex].listLesionSiteFalse == "") {
                                listExportData[objIndex].listLesionSiteFalse +=
                                    listSysFalse[i].arrayFalse[k]["Lesion site"];
                            } else {
                                listExportData[objIndex].listLesionSiteFalse +=
                                    "," + listSysFalse[i].arrayFalse[k]["Lesion site"];
                            }

                            if (listExportData[objIndex].listLesionSizeFalse == "") {
                                listExportData[objIndex].listLesionSizeFalse +=
                                    listSysFalse[i].arrayFalse[k]["Lesion size (mm)"];
                            } else {
                                listExportData[objIndex].listLesionSizeFalse +=
                                    "," + listSysFalse[i].arrayFalse[k]["Lesion size (mm)"];
                            }

                            if (listExportData[objIndex].listLesionTypeFalse == "") {
                                listExportData[objIndex].listLesionTypeFalse +=
                                    listSysFalse[i].arrayFalse[k]["Lesion type"];
                            } else {
                                listExportData[objIndex].listLesionTypeFalse +=
                                    "," + listSysFalse[i].arrayFalse[k]["Lesion type"];
                            }
                        }
                    }
                }
            }
        }

        if (isCaseDensity == true && isLessionType == false) {
            listExportData[objIndex].percentType += " (Compare with Case Density)";
        } else if (isCaseDensity == false && isLessionType == true) {
            listExportData[objIndex].percentType += " (Compare with Lesion Type)";
        } else if (isCaseDensity == true && isLessionType == true) {
            listExportData[objIndex].percentType +=
                " (Compare with Case Density and Lesion Type)";
        }
        listExportData[objIndex].percent =
            (
                (listExportData[objIndex].numberCaseTrue /
                    listExportData[objIndex].totalCase) *
                100
            ).toFixed(2) + "%";
    } else {
        objIndex = listExportData.findIndex(
            (obj) =>
            obj.testId === testId &&
            obj.userId === userId &&
            obj.sessionNo === session_no
        );
        listExportData[objIndex].numberCaseTrue += case_true;
        listExportData[objIndex].totalCase += total_case;

        if (listSysTrue.length !== 0) {
            for (var i = 0; i < listSysTrue.length; i++) {
                if (listExportData[objIndex].listCaseIdTrue == "") {
                    listExportData[objIndex].listCaseIdTrue +=
                        listSysTrue[i].arrayTrue[0]["Case ID"];
                } else {
                    listExportData[objIndex].listCaseIdTrue +=
                        "," + listSysTrue[i].arrayTrue[0]["Case ID"];
                }
            }
        }

        if (listSysTrue.length !== 0) {
            for (var i = 0; i < listSysTrue.length; i++) {
                if (listSysTrue[i].arrayTrue.length !== 0) {
                    for (var k = 0; k < listSysTrue[i].arrayTrue.length; k++) {
                        objIndexLesion = checkLesion.findIndex(
                            (obj) => obj === listSysTrue[i].arrayTrue[k]["Lesion ID"]
                        );
                        if (objIndexLesion == -1) {
                            checkLesion.push(listSysTrue[i].arrayTrue[k]["Lesion ID"] + "");
                            // console.log("CHECKLESION", checkLesion)
                            if (listExportData[objIndex].listAgeTrue == "") {
                                listExportData[objIndex].listAgeTrue +=
                                    listSysTrue[i].arrayTrue[k]["Tuổi"];
                            } else {
                                listExportData[objIndex].listAgeTrue +=
                                    "," + listSysTrue[i].arrayTrue[k]["Tuổi"];
                            }

                            if (listExportData[objIndex].listCaseDensityTrue == "") {
                                listExportData[objIndex].listCaseDensityTrue +=
                                    listSysTrue[i].arrayTrue[k]["Case density"];
                            } else {
                                listExportData[objIndex].listCaseDensityTrue +=
                                    "," + listSysTrue[i].arrayTrue[k]["Case density"];
                            }

                            if (listExportData[objIndex].listLesionSideTrue == "") {
                                listExportData[objIndex].listLesionSideTrue +=
                                    listSysTrue[i].arrayTrue[k]["Lesion side"];
                            } else {
                                listExportData[objIndex].listLesionSideTrue +=
                                    "," + listSysTrue[i].arrayTrue[k]["Lesion side"];
                            }

                            if (listExportData[objIndex].listLesionSiteTrue == "") {
                                listExportData[objIndex].listLesionSiteTrue +=
                                    listSysTrue[i].arrayTrue[k]["Lesion site"];
                            } else {
                                listExportData[objIndex].listLesionSiteTrue +=
                                    "," + listSysTrue[i].arrayTrue[k]["Lesion site"];
                            }

                            if (listExportData[objIndex].listLesionSizeTrue == "") {
                                listExportData[objIndex].listLesionSizeTrue +=
                                    listSysTrue[i].arrayTrue[k]["Lesion size (mm)"];
                            } else {
                                listExportData[objIndex].listLesionSizeTrue +=
                                    "," + listSysTrue[i].arrayTrue[k]["Lesion size (mm)"];
                            }

                            if (listExportData[objIndex].listLesionTypeTrue == "") {
                                listExportData[objIndex].listLesionTypeTrue +=
                                    listSysTrue[i].arrayTrue[k]["Lesion type"];
                            } else {
                                listExportData[objIndex].listLesionTypeTrue +=
                                    "," + listSysTrue[i].arrayTrue[k]["Lesion type"];
                            }
                        }
                    }
                }
            }
        }

        if (listSysFalse.length !== 0) {
            for (var i = 0; i < listSysFalse.length; i++) {
                if (listSysFalse[i].arrayFalse.length !== 0) {
                    for (var k = 0; k < listSysFalse[i].arrayFalse.length; k++) {
                        objIndexLesionFalse = checkLesionFalse.findIndex(
                            (obj) => obj === listSysFalse[i].arrayFalse[k]["Lesion ID"]
                        );
                        if (objIndexLesionFalse == -1) {
                            checkLesionFalse.push(
                                listSysFalse[i].arrayFalse[k]["Lesion ID"] + ""
                            );
                            if (listExportData[objIndex].listCaseIdFalse == "") {
                                listExportData[objIndex].listCaseIdFalse +=
                                    listSysFalse[i].arrayFalse[k]["Case ID"];
                            } else {
                                listExportData[objIndex].listCaseIdFalse +=
                                    "," + listSysFalse[i].arrayFalse[k]["Case ID"];
                            }

                            if (listExportData[objIndex].listAgeFalse == "") {
                                listExportData[objIndex].listAgeFalse +=
                                    listSysFalse[i].arrayFalse[k]["Tuổi"];
                            } else {
                                listExportData[objIndex].listAgeFalse +=
                                    "," + listSysFalse[i].arrayFalse[k]["Tuổi"];
                            }

                            if (listExportData[objIndex].listCaseDensityFalse == "") {
                                listExportData[objIndex].listCaseDensityFalse +=
                                    listSysFalse[i].arrayFalse[k]["Case density"];
                            } else {
                                listExportData[objIndex].listCaseDensityFalse +=
                                    "," + listSysFalse[i].arrayFalse[k]["Case density"];
                            }

                            if (listExportData[objIndex].listLesionSideFalse == "") {
                                listExportData[objIndex].listLesionSideFalse +=
                                    listSysFalse[i].arrayFalse[k]["Lesion side"];
                            } else {
                                listExportData[objIndex].listLesionSideFalse +=
                                    "," + listSysFalse[i].arrayFalse[k]["Lesion side"];
                            }

                            if (listExportData[objIndex].listLesionSiteFalse == "") {
                                listExportData[objIndex].listLesionSiteFalse +=
                                    listSysFalse[i].arrayFalse[k]["Lesion site"];
                            } else {
                                listExportData[objIndex].listLesionSiteFalse +=
                                    "," + listSysFalse[i].arrayFalse[k]["Lesion site"];
                            }

                            if (listExportData[objIndex].listLesionSizeFalse == "") {
                                listExportData[objIndex].listLesionSizeFalse +=
                                    listSysFalse[i].arrayFalse[k]["Lesion size (mm)"];
                            } else {
                                listExportData[objIndex].listLesionSizeFalse +=
                                    "," + listSysFalse[i].arrayFalse[k]["Lesion size (mm)"];
                            }

                            if (listExportData[objIndex].listLesionTypeFalse == "") {
                                listExportData[objIndex].listLesionTypeFalse +=
                                    listSysFalse[i].arrayFalse[k]["Lesion type"];
                            } else {
                                listExportData[objIndex].listLesionTypeFalse +=
                                    "," + listSysFalse[i].arrayFalse[k]["Lesion type"];
                            }
                        }
                    }
                }
            }
        }

        listExportData[objIndex].percent =
            (
                (listExportData[objIndex].numberCaseTrue /
                    listExportData[objIndex].totalCase) *
                100
            ).toFixed(2) + "%";
    }
}

function checkDistinctNonSymmetric(
    testId,
    userId,
    listExportData,
    session_no,
    case_true,
    total_case,
    objDapAn,
    type
) {
    let user = userFilter
        .filter(
            (obj) =>
            obj["test_id"] == testId &&
            obj["user_id"] == userId &&
            obj["session_no"] == session_no
        )
        .map((obj) => obj);

    const check = listExportData
        .filter(
            (obj) =>
            obj["testId"] === testId &&
            obj["userId"] === userId &&
            obj["sessionNo"] === session_no
        )
        .map((obj) => obj);
    if (check.length == 0) {
        listExportData.push({
            testId: testId,
            userId: userId,
            sessionNo: session_no,
            listCaseIdTrue: "",
            listCaseIdFalse: "",
            percentType: type,
            percent: "",
            numberCaseTrue: case_true,
            totalCase: total_case,
            listAgeTrue: "",
            listAgeFalse: "",
            listCaseDensityTrue: "",
            listCaseDensityFalse: "",
            listLesionTypeTrue: "",
            listLesionTypeFalse: "",
            listLesionSideTrue: "",
            listLesionSideFalse: "",
            listLesionSiteTrue: "",
            listLesionSiteFalse: "",
            listLesionSizeTrue: "",
            listLesionSizeFalse: "",
            userAddress: user[0]["Địa chỉ"],
            userGroup: user[0]["Nhóm"],
            userTime: user[0]["Số giờ"],
            userExp: user[0]["Số năm kinh nghiệm"],
        });
        objIndex = listExportData.findIndex(
            (obj) =>
            obj.testId === testId &&
            obj.userId === userId &&
            obj.sessionNo === session_no
        );
        if (case_true > 0) {
            if (listExportData[objIndex].listAgeTrue == "") {
                listExportData[objIndex].listAgeTrue += objDapAn[0]["Tuổi"];
            } else {
                listExportData[objIndex].listAgeTrue += "," + objDapAn[0]["Tuổi"];
            }

            if (listExportData[objIndex].listCaseIdTrue == "") {
                listExportData[objIndex].listCaseIdTrue += objDapAn[0]["Case ID"];
            } else {
                listExportData[objIndex].listCaseIdTrue += "," + objDapAn[0]["Case ID"];
            }

            if (listExportData[objIndex].listCaseDensityTrue == "") {
                listExportData[objIndex].listCaseDensityTrue +=
                    objDapAn[0]["Case density"];
            } else {
                listExportData[objIndex].listCaseDensityTrue +=
                    "," + objDapAn[0]["Case density"];
            }

            if (listExportData[objIndex].listLesionTypeTrue == "") {
                listExportData[objIndex].listLesionTypeTrue +=
                    objDapAn[0]["Lesion type"];
            } else {
                listExportData[objIndex].listLesionTypeTrue +=
                    "," + objDapAn[0]["Lesion type"];
            }

            if (listExportData[objIndex].listLesionSideTrue == "") {
                listExportData[objIndex].listLesionSideTrue +=
                    objDapAn[0]["Lesion side"];
            } else {
                listExportData[objIndex].listLesionSideTrue +=
                    "," + objDapAn[0]["Lesion side"];
            }

            if (listExportData[objIndex].listLesionSiteTrue == "") {
                listExportData[objIndex].listLesionSiteTrue +=
                    objDapAn[0]["Lesion site"];
            } else {
                listExportData[objIndex].listLesionSiteTrue +=
                    "," + objDapAn[0]["Lesion site"];
            }

            if (listExportData[objIndex].listLesionSizeTrue == "") {
                listExportData[objIndex].listLesionSizeTrue +=
                    objDapAn[0]["Lesion size (mm)"];
            } else {
                listExportData[objIndex].listLesionSizeTrue +=
                    "," + objDapAn[0]["Lesion size (mm)"];
            }
        } else if (case_true == 0) {
            if (listExportData[objIndex].listAgeFalse == "") {
                listExportData[objIndex].listAgeFalse += objDapAn[0]["Tuổi"];
            } else {
                listExportData[objIndex].listAgeFalse += "," + objDapAn[0]["Tuổi"];
            }

            if (listExportData[objIndex].listCaseIdFalse == "") {
                listExportData[objIndex].listCaseIdFalse += objDapAn[0]["Case ID"];
            } else {
                listExportData[objIndex].listCaseIdFalse +=
                    "," + objDapAn[0]["Case ID"];
            }

            if (listExportData[objIndex].listCaseDensityFalse == "") {
                listExportData[objIndex].listCaseDensityFalse +=
                    objDapAn[0]["Case density"];
            } else {
                listExportData[objIndex].listCaseDensityFalse +=
                    "," + objDapAn[0]["Case density"];
            }

            if (listExportData[objIndex].listLesionTypeFalse == "") {
                listExportData[objIndex].listLesionTypeFalse +=
                    objDapAn[0]["Lesion type"];
            } else {
                listExportData[objIndex].listLesionTypeFalse +=
                    "," + objDapAn[0]["Lesion type"];
            }

            if (listExportData[objIndex].listLesionSideFalse == "") {
                listExportData[objIndex].listLesionSideFalse +=
                    objDapAn[0]["Lesion side"];
            } else {
                listExportData[objIndex].listLesionSideFalse +=
                    "," + objDapAn[0]["Lesion side"];
            }

            if (listExportData[objIndex].listLesionSiteFalse == "") {
                listExportData[objIndex].listLesionSiteFalse +=
                    objDapAn[0]["Lesion site"];
            } else {
                listExportData[objIndex].listLesionSiteFalse +=
                    "," + objDapAn[0]["Lesion site"];
            }

            if (listExportData[objIndex].listLesionSizeFalse == "") {
                listExportData[objIndex].listLesionSizeFalse +=
                    objDapAn[0]["Lesion size (mm)"];
            } else {
                listExportData[objIndex].listLesionSizeFalse +=
                    "," + objDapAn[0]["Lesion size (mm)"];
            }
        }

        if (isCaseDensity == true && isLessionType == false) {
            listExportData[objIndex].percentType += " (Compare with Case Density)";
        } else if (isCaseDensity == false && isLessionType == true) {
            listExportData[objIndex].percentType += " (Compare with Lesion Type)";
        } else if (isCaseDensity == true && isLessionType == true) {
            listExportData[objIndex].percentType +=
                " (Compare with Case Density and Lesion Type)";
        }
        listExportData[objIndex].percent =
            (
                (listExportData[objIndex].numberCaseTrue /
                    listExportData[objIndex].totalCase) *
                100
            ).toFixed(2) + "%";
    } else {
        objIndex = listExportData.findIndex(
            (obj) =>
            obj.testId === testId &&
            obj.userId === userId &&
            obj.sessionNo === session_no
        );
        listExportData[objIndex].numberCaseTrue += case_true;
        listExportData[objIndex].totalCase += total_case;

        if (case_true > 0) {
            if (listExportData[objIndex].listAgeTrue == "") {
                listExportData[objIndex].listAgeTrue += objDapAn[0]["Tuổi"];
            } else {
                listExportData[objIndex].listAgeTrue += "," + objDapAn[0]["Tuổi"];
            }

            if (listExportData[objIndex].listCaseIdTrue == "") {
                listExportData[objIndex].listCaseIdTrue += objDapAn[0]["Case ID"];
            } else {
                listExportData[objIndex].listCaseIdTrue += "," + objDapAn[0]["Case ID"];
            }

            if (listExportData[objIndex].listCaseDensityTrue == "") {
                listExportData[objIndex].listCaseDensityTrue +=
                    objDapAn[0]["Case density"];
            } else {
                listExportData[objIndex].listCaseDensityTrue +=
                    "," + objDapAn[0]["Case density"];
            }

            if (listExportData[objIndex].listLesionTypeTrue == "") {
                listExportData[objIndex].listLesionTypeTrue +=
                    objDapAn[0]["Lesion type"];
            } else {
                listExportData[objIndex].listLesionTypeTrue +=
                    "," + objDapAn[0]["Lesion type"];
            }

            if (listExportData[objIndex].listLesionSideTrue == "") {
                listExportData[objIndex].listLesionSideTrue +=
                    objDapAn[0]["Lesion side"];
            } else {
                listExportData[objIndex].listLesionSideTrue +=
                    "," + objDapAn[0]["Lesion side"];
            }

            if (listExportData[objIndex].listLesionSiteTrue == "") {
                listExportData[objIndex].listLesionSiteTrue +=
                    objDapAn[0]["Lesion site"];
            } else {
                listExportData[objIndex].listLesionSiteTrue +=
                    "," + objDapAn[0]["Lesion site"];
            }

            if (listExportData[objIndex].listLesionSizeTrue == "") {
                listExportData[objIndex].listLesionSizeTrue +=
                    objDapAn[0]["Lesion size (mm)"];
            } else {
                listExportData[objIndex].listLesionSizeTrue +=
                    "," + objDapAn[0]["Lesion size (mm)"];
            }
        } else if (case_true == 0) {
            if (listExportData[objIndex].listAgeFalse == "") {
                listExportData[objIndex].listAgeFalse += objDapAn[0]["Tuổi"];
            } else {
                listExportData[objIndex].listAgeFalse += "," + objDapAn[0]["Tuổi"];
            }

            if (listExportData[objIndex].listCaseIdFalse == "") {
                listExportData[objIndex].listCaseIdFalse += objDapAn[0]["Case ID"];
            } else {
                listExportData[objIndex].listCaseIdFalse +=
                    "," + objDapAn[0]["Case ID"];
            }

            if (listExportData[objIndex].listCaseDensityFalse == "") {
                listExportData[objIndex].listCaseDensityFalse +=
                    objDapAn[0]["Case density"];
            } else {
                listExportData[objIndex].listCaseDensityFalse +=
                    "," + objDapAn[0]["Case density"];
            }

            if (listExportData[objIndex].listLesionTypeFalse == "") {
                listExportData[objIndex].listLesionTypeFalse +=
                    objDapAn[0]["Lesion type"];
            } else {
                listExportData[objIndex].listLesionTypeFalse +=
                    "," + objDapAn[0]["Lesion type"];
            }

            if (listExportData[objIndex].listLesionSideFalse == "") {
                listExportData[objIndex].listLesionSideFalse +=
                    objDapAn[0]["Lesion side"];
            } else {
                listExportData[objIndex].listLesionSideFalse +=
                    "," + objDapAn[0]["Lesion side"];
            }

            if (listExportData[objIndex].listLesionSiteFalse == "") {
                listExportData[objIndex].listLesionSiteFalse +=
                    objDapAn[0]["Lesion site"];
            } else {
                listExportData[objIndex].listLesionSiteFalse +=
                    "," + objDapAn[0]["Lesion site"];
            }

            if (listExportData[objIndex].listLesionSizeFalse == "") {
                listExportData[objIndex].listLesionSizeFalse +=
                    objDapAn[0]["Lesion size (mm)"];
            } else {
                listExportData[objIndex].listLesionSizeFalse +=
                    "," + objDapAn[0]["Lesion size (mm)"];
            }
        }
        listExportData[objIndex].percent =
            (
                (listExportData[objIndex].numberCaseTrue /
                    listExportData[objIndex].totalCase) *
                100
            ).toFixed(2) + "%";
    }
}

function splitUniqueTest(unique) {
    return unique.split(":");
}

function calcNormal(objRowData, objDapAn) {
    var count = 0;
    if (isCaseDensity == true) {
        const maxRatingValue = Math.max(...objRowData.map((o) => o["rating"]), 0);
        if (maxRatingValue <= 2) {
            for (var i = 0; i < objRowData.length; i++) {
                if (objRowData[i]["rating"] <= 2) {
                    objDapAn.forEach(function(caseDapAn) {
                        if (
                            caseDensityArrayValue.indexOf(caseDapAn["Case density"]) != -1 &&
                            objRowData[i]["Case density (user)"] === caseDapAn["Case density"]
                        ) {
                            count++;
                        }
                    });
                }
            }
        }
        if (count > 0) return true;
    } else {
        const maxRatingValue = Math.max(...objRowData.map((o) => o["rating"]), 0);
        if (maxRatingValue > 2) count++;
        if (count == 0) return true;
    }
    return false;
}

function calcAbNormal(objRowData, objDapAn) {
    var count = 0;
    var countDensityAb = 0;
    if (isCaseDensity == true || isLessionType == true) {
        for (var i = 0; i < objRowData.length; i++) {
            checkDensity = objDapAn
                .filter(
                    (obj) => caseDensityArrayValue.indexOf(obj["Case density"]) != -1 &&
                    obj["Case density"] === objRowData[i]["Case density (user)"]
                )
                .map((obj) => obj);
            if (checkDensity.length != 0) {
                countDensityAb++;
            }
        }

        for (var i = 0; i < objRowData.length; i++) {
            if (
                objRowData[i]["selectX"] > 0 &&
                objRowData[i]["selectY"] > 0 &&
                objRowData[i]["rating"] >= 3
            ) {
                objDapAn.forEach(function(caseDapAn) {
                    if (isCaseDensity == true && isLessionType == true) {
                        if (
                            checkLesionType(
                                caseDapAn["Lesion type"],
                                objRowData[i]["Lesion type(User)"]
                            ) == true &&
                            countDensityAb > 0
                        ) {
                            count++;
                        }
                    } else if (isCaseDensity == true && isLessionType == false) {
                        if (countDensityAb > 0) {
                            count++;
                        }
                    } else if (isCaseDensity == false && isLessionType == true) {
                        if (
                            checkLesionType(
                                caseDapAn["Lesion type"],
                                objRowData[i]["Lesion type(User)"]
                            ) == true
                        ) {
                            count++;
                        }
                    }
                });
            }
        }
        if (count >= 1) return true;
    } else {
        for (var i = 0; i < objRowData.length; i++) {
            if (objRowData[i]["selectX"] > 0 && objRowData[i]["selectY"] > 0) {
                if (objRowData[i]["rating"] >= 3) {
                    count++;
                }
            }
        }
    }
    if (count >= 1) return true;
    return false;
}

function calcReCall(objRowData, objDapAn) {
    var count = 0;
    var countDensityRecall = 0;
    var checkDensity = [];
    let check = [];
    if (isCaseDensity == true || isLessionType == true) {
        for (var i = 0; i < objRowData.length; i++) {
            checkDensity = objDapAn
                .filter(
                    (obj) => caseDensityArrayValue.indexOf(obj["Case density"]) != -1 &&
                    obj["Case density"] === objRowData[i]["Case density (user)"]
                )
                .map((obj) => obj);
            if (checkDensity.length != 0) {
                countDensityRecall++;
            }
        }
        for (var i = 0; i < objRowData.length; i++) {
            check = objDapAn
                .filter(
                    (obj) =>
                    obj["Lesion ID"] === objRowData[i]["lesionID"] &&
                    objRowData[i]["distance"] > 0 &&
                    objRowData[i]["rating"] >= 3 &&
                    objRowData[i]["selectX"] > 0 &&
                    objRowData[i]["selectY"] > 0 &&
                    (isCaseDensity ? countDensityRecall > 0 : true) &&
                    (isLessionType ?
                        checkLesionType(
                            obj["Lesion type"],
                            objRowData[i]["Lesion type(User)"]
                        ) === true :
                        true)
                )
                .map((obj) => obj);
            if (check.length != 0) {
                count++;
            }
        }
        if (count > 0) {
            return true;
        }
    } else {
        for (var i = 0; i < objRowData.length; i++) {
            if (
                objRowData[i]["selectX"] > 0 &&
                objRowData[i]["selectY"] > 0 &&
                parseInt(objRowData[i]["rating"]) > 2
            ) {
                objDapAn.forEach(function(caseDapAn) {
                    if (
                        objRowData[i]["lesionID"] === caseDapAn["Lesion ID"] &&
                        parseInt(objRowData[i]["distance"]) > 0
                    ) {
                        count++;
                    }
                });
            }
        }
    }
    if (count >= 1) return true;
    return false;
}

function checkLesionType(dapan, caserow) {
    var arr1 = [];
    var arr2 = [];
    let check = 0;
    if (dapan != undefined) {
        arr1 = dapan.split(" / ").filter(s => lessionTypeArrayValue.indexOf(s) != -1);
    }
    if (caserow != undefined) {
        arr2 = caserow.split(",").filter(s => lessionTypeArrayValue.indexOf(s) != -1);
    }

    arr1.forEach((element) => {
        arr2.forEach((element1) => {
            if (element1 == element) {
                check++;
            }
        });
    });

    if (check == 0) return false;
    return true;
}

function calcSymmetric(objRowData, objDapAn) {
    var listSysTrue = [];
    var listSysFalse = [];
    var answerTrue = null;
    var answerFalse = null;
    var countAnswer = 0;
    var countTotal = 0;
    var checkXY = [];
    var checkFalse = [];
    var checkTruthXY = [];
    var checkFrame = [];
    var newData = [];
    var listCheck1 = [];
    var listCheck2 = [];

    objRowData.forEach((item) => {
        if (
            parseInt(item.frame) >= 0 &&
            parseInt(item["selectX"]) >= 0 &&
            parseInt(item["selectY"]) >= 0
        ) {
            newData.push(item);
        }
    });
    // objRowData = newData;
    const uniqueLesionId = [
        ...new Set(
            objDapAn.map(
                (item) => item["Test set"] + ":" + item["Case ID"] + ":" + item["Frame"]
            )
        ),
    ];
    countTotal = objDapAn.length;
    //  TRUONG HOP =1 FRAME
    if (uniqueLesionId.length == 1) {
        for (var i = 0; i < objRowData.length; i++) {
            if (
                checkXY.indexOf(
                    objRowData[i]["truthX"] +
                    "" +
                    objRowData[i]["truthY"] +
                    "" +
                    objRowData[i]["lesionID"]
                ) == -1
            ) {
                const check = objDapAn
                    .filter(
                        (obj) =>
                        obj["Test set"] === objRowData[i]["test_id"] &&
                        obj["Case ID"] === objRowData[i]["case_id"] &&
                        obj["Lesion ID"] === objRowData[i]["lesionID"] &&
                        obj["Lesion ID"] === objRowData[i]["lesionID"] &&
                        obj["TruthX"] === objRowData[i]["truthX"] &&
                        obj["TruthY"] === objRowData[i]["truthY"] &&
                        objRowData[i]["distance"] > 0 &&
                        objRowData[i]["rating"] > 2 &&
                        objRowData[i]["selectX"] > 0 &&
                        objRowData[i]["selectY"] > 0 &&
                        (isCaseDensity ? countDensity > 0 : true) &&
                        (isLessionType ?
                            checkLesionType(
                                obj["Lesion type"],
                                objRowData[i]["Lesion type(User)"]
                            ) === true :
                            true)
                    )
                    .map((obj) => obj);
                if (check.length != 0) {
                    listCheck1.push(check);
                    listSysTrue.push({
                        user: objRowData[i]["user_id"],
                        arrayTrue: check,
                    });
                    answerTrue = objDapAn[0];
                    checkXY.push(
                        objRowData[i]["truthX"] +
                        "" +
                        objRowData[i]["truthY"] +
                        "" +
                        objRowData[i]["lesionID"]
                    );
                    countAnswer++;
                } else {
                    answerFalse = objDapAn[0];
                }
                // listSysFalse = const check = objDapAn
                // .filter(obj => obj["Test set"] === objRowData[i]["test_id"]
            }
        }

        // var arrFalse = objDapAn.filter(obj => listCheck1.indexOf(obj) === -1);
        var arrFalse = objDapAn.filter(
            (elm) =>
            !listCheck1
            .map((elm) => JSON.stringify(elm[0]))
            .includes(JSON.stringify(elm))
        );
        listSysFalse.push({
            user: objRowData[0]["user_id"],
            arrayFalse: arrFalse,
        });
    }
    //  TRUONG HOP >=2 FRAME
    else {
        for (var i = 0; i < objRowData.length; i++) {
            if (
                checkXY.indexOf(
                    objRowData[i]["truthX"] +
                    "" +
                    objRowData[i]["truthY"] +
                    +"" +
                    objRowData[i]["case_id"] +
                    "" +
                    objRowData[i]["lesionID"] +
                    "" +
                    objRowData[i]["frame"]
                ) == -1
            ) {
                const check = objDapAn
                    .filter(
                        (obj) =>
                        obj["Test set"] === objRowData[i]["test_id"] &&
                        obj["Case ID"] === objRowData[i]["case_id"] &&
                        obj["Lesion ID"] === objRowData[i]["lesionID"] &&
                        // && obj["TruthX"] === objRowData[i]["truthX"]
                        // && obj["TruthY"] === objRowData[i]["truthY"]
                        objRowData[i]["distance"] > 0 &&
                        objRowData[i]["rating"] > 2 &&
                        (isCaseDensity ? countDensity > 0 : true) &&
                        (isLessionType ?
                            checkLesionType(
                                obj["Lesion type"],
                                objRowData[i]["Lesion type(User)"]
                            ) === true :
                            true)
                    )
                    .map((obj) => obj);
                if (check.length != 0) {
                    // listSysTrue.push(objRowData[i]);
                    listCheck2.push(check);
                    listSysTrue.push({
                        user: objRowData[i]["user_id"],
                        arrayTrue: check,
                    });
                    answerTrue = objDapAn[0];
                    checkXY.push(
                        objRowData[i]["truthX"] +
                        "" +
                        objRowData[i]["truthY"] +
                        +"" +
                        objRowData[i]["case_id"] +
                        "" +
                        objRowData[i]["lesionID"] +
                        "" +
                        objRowData[i]["frame"]
                    );
                    countAnswer++;
                } else {
                    // listSysFalse.push(objRowData[i]);
                    answerFalse = objDapAn[0];
                }
                //}
            }
        }
        // var arrFalse = objDapAn.filter(obj => listCheck2.indexOf(obj) === -1);
        var arrFalse = objDapAn.filter(
            (elm) =>
            !listCheck2
            .map((elm) => JSON.stringify(elm[0]))
            .includes(JSON.stringify(elm))
        );
        listSysFalse.push({
            user: objRowData[0]["user_id"],
            arrayFalse: arrFalse,
        });
    }

    return [
        countAnswer,
        countTotal,
        listSysTrue,
        listSysFalse,
        answerTrue,
        answerFalse,
    ];
}

function calcNonSymmetric(objRowData, objDapAn) {
    var listSysTrue = [];
    var answerTrue = null;
    var answerFalse = null;
    var listSysFalse = [];
    var countAnswer = 0;
    var countTotal = 0;
    var checkLesion = [];
    var listCheck1 = [];
    const uniqueLesionId = [
        ...new Set(objDapAn.map((item) => item["Lesion ID"])),
    ];

    countTotal = uniqueLesionId.length;
    for (var i = 0; i < objRowData.length; i++) {
        if (
            checkLesion.indexOf(
                objRowData[i]["test_id"] +
                "-" +
                objRowData[i]["user_id"] +
                "-" +
                objRowData[i]["case_id"] +
                "-" +
                objRowData[i]["lesionID"]
            ) == -1
        ) {
            const check = objDapAn
                .filter(
                    (obj) =>
                    obj["Test set"] === objRowData[i]["test_id"] &&
                    obj["Case ID"] === objRowData[i]["case_id"] &&
                    obj["Lesion ID"] === objRowData[i]["lesionID"] &&
                    parseInt(objRowData[i]["distance"]) > 0 &&
                    objRowData[i]["rating"] >= 3 &&
                    (isCaseDensity ? countDensity > 0 : true) &&
                    (isLessionType ?
                        checkLesionType(
                            obj["Lesion type"],
                            objRowData[i]["Lesion type(User)"]
                        ) === true :
                        true)
                )
                .map((obj) => obj);

            if (check.length != 0) {
                check.forEach((element) => {
                    let temp = [];
                    temp.push(element);
                    listCheck1.push(temp);
                });

                listSysTrue.push({
                    user: objRowData[i]["user_id"],
                    arrayTrue: check,
                });
                answerTrue = objDapAn[0];
                checkLesion.push(
                    objRowData[i]["test_id"] +
                    "-" +
                    objRowData[i]["user_id"] +
                    "-" +
                    objRowData[i]["case_id"] +
                    "-" +
                    objRowData[i]["lesionID"]
                );
                countAnswer++;
            } else {
                answerFalse = objDapAn[0];
            }
        }
    }
    // console.log("CHECK DATA",objRowData)
    var arrFalse = objDapAn.filter(
        (elm) =>
        !listCheck1
        .map((elm) => JSON.stringify(elm[0]))
        .includes(JSON.stringify(elm))
    );
    // console.log("CHECKKK", listCheck1)
    // console.log("ARRRFALSE", arrFalse)
    listSysFalse.push({
        user: objRowData[0]["user_id"],
        arrayFalse: arrFalse,
    });

    return [
        countAnswer,
        countTotal,
        listSysTrue,
        listSysFalse,
        answerTrue,
        answerFalse,
    ];
}

// TINH TOAN MUC SO 2
function calcTruePercentofAnyCase(objRowData, objDapAn, dropdownValue) {
    // tach thanh các testid, caseid
    // list data cua caseid tren (testid,caseid,listuser,totaltrue,total)
    // neu dung, listuser[], -> tong so luong
    if (objRowData.length == 0) {
        return;
    }
    objIndex = listCaseIdbyTestId.findIndex(
        (obj) =>
        obj.testId === objRowData[0]["test_id"] &&
        obj.caseId === objRowData[0]["case_id"] &&
        obj.type === dropdownObject[dropdownValue]
    );
    if (objIndex == -1) {
        listCaseIdbyTestId.push({
            testId: objRowData[0]["test_id"],
            caseId: objRowData[0]["case_id"],
            lesionId: null,
            truthX: null,
            truthY: null,
            totalUserTruth: 0,
            totalUser: 0,
            listUserIdTrue: "",
            listUserAddressTrue: "",
            listUserGroupTrue: "",
            listUserTimeTrue: "",
            listUserExpTrue: "",
            listUserIdFalse: "",
            listUserAddressFalse: "",
            listUserGroupFalse: "",
            listUserTimeFalse: "",
            listUserExpFalse: "",
            listAge: "",
            listCaseDensity: "",
            listLesionType: "",
            type: dropdownObject[dropdownValue],
            lesionSide: "",
            lesionSite: "",
            lesionSize: "",
        });
    }
    const checkUser = userFilter.filter(
        (obj) => objRowData[0]["user_id"] === obj["user_id"]
    );
    currentIndex = listCaseIdbyTestId.findIndex(
        (obj) =>
        obj.testId === objRowData[0]["test_id"] &&
        obj.caseId === objRowData[0]["case_id"] &&
        obj.type === dropdownObject[dropdownValue]
    );

    switch (dropdownValue) {
        case "1":
            if (calcNormal(objRowData, objDapAn) == true) {
                listCaseIdbyTestId[currentIndex]["totalUserTruth"]++;
                listCaseIdbyTestId[currentIndex]["totalUser"]++;
                if (listCaseIdbyTestId[currentIndex]["listAge"] === "") {
                    listCaseIdbyTestId[currentIndex]["listAge"] += objDapAn[0]["Tuổi"];
                }
                listCaseIdbyTestId[currentIndex]["listUserIdTrue"] +=
                    objRowData[0]["user_id"] + ",";
                listCaseIdbyTestId[currentIndex]["listUserAddressTrue"] +=
                    checkUser[0]["Địa chỉ"] + ",";
                listCaseIdbyTestId[currentIndex]["listUserGroupTrue"] +=
                    checkUser[0]["Nhóm"] + ",";
                listCaseIdbyTestId[currentIndex]["listUserTimeTrue"] +=
                    checkUser[0]["Số giờ"] + ",";
                listCaseIdbyTestId[currentIndex]["listUserExpTrue"] +=
                    checkUser[0]["Số năm kinh nghiệm"] + ",";
            } else {
                listCaseIdbyTestId[currentIndex]["totalUser"]++;
                if (listCaseIdbyTestId[currentIndex]["listAge"] === "") {
                    listCaseIdbyTestId[currentIndex]["listAge"] +=
                        objDapAn[0]["Tuổi"] + ",";
                }
                listCaseIdbyTestId[currentIndex]["listUserIdFalse"] +=
                    objRowData[0]["user_id"] + ",";
                listCaseIdbyTestId[currentIndex]["listUserAddressFalse"] +=
                    checkUser[0]["Địa chỉ"] + ",";
                listCaseIdbyTestId[currentIndex]["listUserGroupFalse"] +=
                    checkUser[0]["Nhóm"] + ",";
                listCaseIdbyTestId[currentIndex]["listUserTimeFalse"] +=
                    checkUser[0]["Số giờ"] + ",";
                listCaseIdbyTestId[currentIndex]["listUserExpFalse"] +=
                    checkUser[0]["Số năm kinh nghiệm"] + ",";
            }
            break;
        case "2":
            if (calcAbNormal(objRowData, objDapAn) == true) {
                listCaseIdbyTestId[currentIndex]["totalUserTruth"]++;
                listCaseIdbyTestId[currentIndex]["totalUser"]++;
                if (listCaseIdbyTestId[currentIndex]["listAge"] === "") {
                    listCaseIdbyTestId[currentIndex]["listAge"] +=
                        objDapAn[0]["Tuổi"] + ",";
                }

                if (listCaseIdbyTestId[currentIndex]["listCaseDensity"] === "") {
                    listCaseIdbyTestId[currentIndex]["listCaseDensity"] +=
                        objDapAn[0]["Case density"] + ",";
                }

                if (listCaseIdbyTestId[currentIndex]["listLesionType"] === "") {
                    listCaseIdbyTestId[currentIndex]["listLesionType"] +=
                        objDapAn[0]["Lesion type"] + ",";
                }

                if (listCaseIdbyTestId[currentIndex]["lesionSide"] === "") {
                    listCaseIdbyTestId[currentIndex]["lesionSide"] +=
                        objDapAn[0]["Lesion side"] + ",";
                }

                if (listCaseIdbyTestId[currentIndex]["lesionSite"] === "") {
                    listCaseIdbyTestId[currentIndex]["lesionSite"] +=
                        objDapAn[0]["Lesion site"] + ",";
                }

                if (listCaseIdbyTestId[currentIndex]["lesionSize"] === "") {
                    listCaseIdbyTestId[currentIndex]["lesionSize"] +=
                        objDapAn[0]["Lesion size (mm)"] + ",";
                }

                listCaseIdbyTestId[currentIndex]["listUserIdTrue"] +=
                    objRowData[0]["user_id"] + ",";
                listCaseIdbyTestId[currentIndex]["listUserAddressTrue"] +=
                    checkUser[0]["Địa chỉ"] + ",";
                listCaseIdbyTestId[currentIndex]["listUserGroupTrue"] +=
                    checkUser[0]["Nhóm"] + ",";
                listCaseIdbyTestId[currentIndex]["listUserTimeTrue"] +=
                    checkUser[0]["Số giờ"] + ",";
                listCaseIdbyTestId[currentIndex]["listUserExpTrue"] +=
                    checkUser[0]["Số năm kinh nghiệm"] + ",";
            } else {
                listCaseIdbyTestId[currentIndex]["totalUser"]++;
                if (listCaseIdbyTestId[currentIndex]["listAge"] === "") {
                    listCaseIdbyTestId[currentIndex]["listAge"] +=
                        objDapAn[0]["Tuổi"] + ",";
                }

                if (listCaseIdbyTestId[currentIndex]["listCaseDensity"] === "") {
                    listCaseIdbyTestId[currentIndex]["listCaseDensity"] +=
                        objDapAn[0]["Case density"] + ",";
                }

                if (listCaseIdbyTestId[currentIndex]["listLesionType"] === "") {
                    listCaseIdbyTestId[currentIndex]["listLesionType"] +=
                        objDapAn[0]["Lesion type"] + ",";
                }

                if (listCaseIdbyTestId[currentIndex]["lesionSide"] === "") {
                    listCaseIdbyTestId[currentIndex]["lesionSide"] +=
                        objDapAn[0]["Lesion side"] + ",";
                }

                if (listCaseIdbyTestId[currentIndex]["lesionSite"] === "") {
                    listCaseIdbyTestId[currentIndex]["lesionSite"] +=
                        objDapAn[0]["Lesion site"] + ",";
                }

                if (listCaseIdbyTestId[currentIndex]["lesionSize"] === "") {
                    listCaseIdbyTestId[currentIndex]["lesionSize"] +=
                        objDapAn[0]["Lesion size (mm)"] + ",";
                }

                listCaseIdbyTestId[currentIndex]["listUserIdFalse"] +=
                    objRowData[0]["user_id"] + ",";
                listCaseIdbyTestId[currentIndex]["listUserAddressFalse"] +=
                    checkUser[0]["Địa chỉ"] + ",";
                listCaseIdbyTestId[currentIndex]["listUserGroupFalse"] +=
                    checkUser[0]["Nhóm"] + ",";
                listCaseIdbyTestId[currentIndex]["listUserTimeFalse"] +=
                    checkUser[0]["Số giờ"] + ",";
                listCaseIdbyTestId[currentIndex]["listUserExpFalse"] +=
                    checkUser[0]["Số năm kinh nghiệm"] + ",";
            }
            break;
        case "5":
            if (calcReCall(objRowData, objDapAn) == true) {
                listCaseIdbyTestId[currentIndex]["totalUserTruth"]++;
                listCaseIdbyTestId[currentIndex]["totalUser"]++;
                if (listCaseIdbyTestId[currentIndex]["listAge"] === "") {
                    listCaseIdbyTestId[currentIndex]["listAge"] +=
                        objDapAn[0]["Tuổi"] + ",";
                }
                if (listCaseIdbyTestId[currentIndex]["listCaseDensity"] === "") {
                    listCaseIdbyTestId[currentIndex]["listCaseDensity"] +=
                        objDapAn[0]["Case density"] + ",";
                }
                if (listCaseIdbyTestId[currentIndex]["listLesionType"] === "") {
                    listCaseIdbyTestId[currentIndex]["listLesionType"] +=
                        objDapAn[0]["Lesion type"] + ",";
                }

                if (listCaseIdbyTestId[currentIndex]["lesionSide"] === "") {
                    listCaseIdbyTestId[currentIndex]["lesionSide"] +=
                        objDapAn[0]["Lesion side"] + ",";
                }

                if (listCaseIdbyTestId[currentIndex]["lesionSite"] === "") {
                    listCaseIdbyTestId[currentIndex]["lesionSite"] +=
                        objDapAn[0]["Lesion site"] + ",";
                }

                if (listCaseIdbyTestId[currentIndex]["lesionSize"] === "") {
                    listCaseIdbyTestId[currentIndex]["lesionSize"] +=
                        objDapAn[0]["Lesion size (mm)"] + ",";
                }

                listCaseIdbyTestId[currentIndex]["listUserIdTrue"] +=
                    objRowData[0]["user_id"] + ",";
                listCaseIdbyTestId[currentIndex]["listUserAddressTrue"] +=
                    checkUser[0]["Địa chỉ"] + ",";
                listCaseIdbyTestId[currentIndex]["listUserGroupTrue"] +=
                    checkUser[0]["Nhóm"] + ",";
                listCaseIdbyTestId[currentIndex]["listUserTimeTrue"] +=
                    checkUser[0]["Số giờ"] + ",";
                listCaseIdbyTestId[currentIndex]["listUserExpTrue"] +=
                    checkUser[0]["Số năm kinh nghiệm"] + ",";
            } else {
                listCaseIdbyTestId[currentIndex]["totalUser"]++;
                if (listCaseIdbyTestId[currentIndex]["listAge"] === "") {
                    listCaseIdbyTestId[currentIndex]["listAge"] +=
                        objDapAn[0]["Tuổi"] + ",";
                }
                if (listCaseIdbyTestId[currentIndex]["listCaseDensity"] === "") {
                    listCaseIdbyTestId[currentIndex]["listCaseDensity"] +=
                        objDapAn[0]["Case density"] + ",";
                }
                if (listCaseIdbyTestId[currentIndex]["listLesionType"] === "") {
                    listCaseIdbyTestId[currentIndex]["listLesionType"] +=
                        objDapAn[0]["Lesion type"] + ",";
                }
                if (listCaseIdbyTestId[currentIndex]["lesionSide"] === "") {
                    listCaseIdbyTestId[currentIndex]["lesionSide"] +=
                        objDapAn[0]["Lesion side"] + ",";
                }

                if (listCaseIdbyTestId[currentIndex]["lesionSite"] === "") {
                    listCaseIdbyTestId[currentIndex]["lesionSite"] +=
                        objDapAn[0]["Lesion site"] + ",";
                }

                if (listCaseIdbyTestId[currentIndex]["lesionSize"] === "") {
                    listCaseIdbyTestId[currentIndex]["lesionSize"] +=
                        objDapAn[0]["Lesion size (mm)"] + ",";
                }
                listCaseIdbyTestId[currentIndex]["listUserIdFalse"] +=
                    objRowData[0]["user_id"] + ",";
                listCaseIdbyTestId[currentIndex]["listUserAddressFalse"] +=
                    checkUser[0]["Địa chỉ"] + ",";
                listCaseIdbyTestId[currentIndex]["listUserGroupFalse"] +=
                    checkUser[0]["Nhóm"] + ",";
                listCaseIdbyTestId[currentIndex]["listUserTimeFalse"] +=
                    checkUser[0]["Số giờ"] + ",";
                listCaseIdbyTestId[currentIndex]["listUserExpFalse"] +=
                    checkUser[0]["Số năm kinh nghiệm"] + ",";
            }
            break;
    }
}

function calcTruePercentofAnyLesionDX(objRowData, objDapAn) {
    // tach thanh các testid, caseid
    // list data cua caseid tren (testid,caseid,listuser,totaltrue,total)
    // neu dung, listuser[], -> tong so luong
    if (objRowData.length == 0) {
        return;
    }
    objIndex = listCaseIdbyTestId.findIndex(
        (obj) =>
        obj.testId == objRowData[0]["test_id"] &&
        obj.caseId == objRowData[0]["case_id"] &&
        obj.lesionId == objRowData[0]["lesionID"] &&
        obj.truthX == objDapAn[0]["TruthX"] &&
        obj.truthY == objDapAn[0]["TruthY"] &&
        obj.type === "Symmetric"
    );

    if (objIndex == -1) {
        listCaseIdbyTestId.push({
            testId: objRowData[0]["test_id"],
            caseId: objRowData[0]["case_id"],
            lesionId: objRowData[0]["lesionID"],
            truthX: objDapAn[0]["TruthX"],
            truthY: objDapAn[0]["TruthY"],
            totalUserTruth: 0,
            totalUser: 0,
            listUserIdTrue: "",
            listUserAddressTrue: "",
            listUserGroupTrue: "",
            listUserTimeTrue: "",
            listUserExpTrue: "",
            listUserIdFalse: "",
            listUserAddressFalse: "",
            listUserGroupFalse: "",
            listUserTimeFalse: "",
            listUserExpFalse: "",
            listAge: "",
            listCaseDensity: "",
            listLesionType: "",
            type: "Symmetric",
            lesionSide: "",
            lesionSite: "",
            lesionSize: "",
        });
    }
    // const checkUser = userFilter
    //     .filter(obj => objRowData[0]["user_id"] === obj["user_id"])

    currentIndex = listCaseIdbyTestId.findIndex(
        (obj) =>
        obj.testId === objRowData[0]["test_id"] &&
        obj.caseId === objRowData[0]["case_id"] &&
        obj.lesionId === objRowData[0]["lesionID"] &&
        obj.truthX === objDapAn[0]["TruthX"] &&
        obj.truthY === objDapAn[0]["TruthY"] &&
        obj.type === "Symmetric"
    );
    let symmetric = calcSymmetric(objRowData, objDapAn);

    if (symmetric[3].length != 0) {}
    let listSysTrue = symmetric[2];
    let listSysFalse = symmetric[3];

    if (symmetric[0] > 0) {
        listCaseIdbyTestId[currentIndex]["totalUserTruth"] += 1;
    }
    if (symmetric[1] > 0) {
        listCaseIdbyTestId[currentIndex]["totalUser"] += 1;
    }
    if (symmetric[4] === null) {
        if (listCaseIdbyTestId[currentIndex]["listCaseDensity"] === "") {
            listCaseIdbyTestId[currentIndex]["listCaseDensity"] +=
                symmetric[5] === null ? "" : symmetric[5]["Case density"] + ",";
        }

        if (listCaseIdbyTestId[currentIndex]["listLesionType"] === "") {
            listCaseIdbyTestId[currentIndex]["listLesionType"] +=
                symmetric[5] === null ? "" : symmetric[5]["Lesion type"] + ",";
        }

        if (listCaseIdbyTestId[currentIndex]["listAge"] === "") {
            listCaseIdbyTestId[currentIndex]["listAge"] +=
                symmetric[5] === null ? "" : symmetric[5]["Tuổi"] + ",";
        }

        if (listCaseIdbyTestId[currentIndex]["lesionSide"] === "") {
            listCaseIdbyTestId[currentIndex]["lesionSide"] +=
                symmetric[5] === null ? "" : symmetric[5]["Lesion side"] + ",";
        }

        if (listCaseIdbyTestId[currentIndex]["lesionSite"] === "") {
            listCaseIdbyTestId[currentIndex]["lesionSite"] +=
                symmetric[5] === null ? "" : symmetric[5]["Lesion site"] + ",";
        }

        if (listCaseIdbyTestId[currentIndex]["lesionSize"] === "") {
            listCaseIdbyTestId[currentIndex]["lesionSize"] +=
                symmetric[5] === null ? "" : symmetric[5]["Lesion size (mm)"] + ",";
        }
    } else if (symmetric[5] === null) {
        if (listCaseIdbyTestId[currentIndex]["listCaseDensity"] === "") {
            listCaseIdbyTestId[currentIndex]["listCaseDensity"] +=
                symmetric[4] === null ? "" : symmetric[4]["Case density"] + ",";
        }

        if (listCaseIdbyTestId[currentIndex]["listLesionType"] === "") {
            listCaseIdbyTestId[currentIndex]["listLesionType"] +=
                symmetric[4] === null ? "" : symmetric[4]["Lesion type"] + ",";
        }

        if (listCaseIdbyTestId[currentIndex]["listAge"] === "") {
            listCaseIdbyTestId[currentIndex]["listAge"] +=
                symmetric[4] === null ? "" : symmetric[4]["Tuổi"] + ",";
        }

        if (listCaseIdbyTestId[currentIndex]["lesionSide"] === "") {
            listCaseIdbyTestId[currentIndex]["lesionSide"] +=
                symmetric[4] === null ? "" : symmetric[4]["Lesion side"] + ",";
        }

        if (listCaseIdbyTestId[currentIndex]["lesionSite"] === "") {
            listCaseIdbyTestId[currentIndex]["lesionSite"] +=
                symmetric[4] === null ? "" : symmetric[4]["Lesion site"] + ",";
        }

        if (listCaseIdbyTestId[currentIndex]["lesionSize"] === "") {
            listCaseIdbyTestId[currentIndex]["lesionSize"] +=
                symmetric[4] === null ? "" : symmetric[4]["Lesion size (mm)"] + ",";
        }
    }

    listCaseIdbyTestId[currentIndex]["listUserIdTrue"] +=
        symmetric[2].length === 0 ? "" : symmetric[2][0]["user"] + ",";

    if (symmetric[3][0].arrayFalse.length !== 0) {
        listCaseIdbyTestId[currentIndex]["listUserIdFalse"] +=
            symmetric[3].length === 0 ? "" : symmetric[3][0]["user"] + ",";
    }

    listCaseIdbyTestId[currentIndex]["listUserAddressTrue"] +=
        symmetric[2].length === 0 ?
        "" :
        userFilter.filter(
            (obj) => symmetric[2][0]["user"] === obj["user_id"]
        )[0]["Địa chỉ"] + ",";
    listCaseIdbyTestId[currentIndex]["listUserGroupTrue"] +=
        symmetric[2].length === 0 ?
        "" :
        userFilter.filter(
            (obj) => symmetric[2][0]["user"] === obj["user_id"]
        )[0]["Nhóm"] + ",";
    listCaseIdbyTestId[currentIndex]["listUserTimeTrue"] +=
        symmetric[2].length === 0 ?
        "" :
        userFilter.filter(
            (obj) => symmetric[2][0]["user"] === obj["user_id"]
        )[0]["Số giờ"] + ",";
    listCaseIdbyTestId[currentIndex]["listUserExpTrue"] +=
        symmetric[2].length === 0 ?
        "" :
        userFilter.filter(
            (obj) => symmetric[2][0]["user"] === obj["user_id"]
        )[0]["Số năm kinh nghiệm"] + ",";

    if (symmetric[3][0].arrayFalse.length !== 0) {
        listCaseIdbyTestId[currentIndex]["listUserAddressFalse"] +=
            symmetric[3].length === 0 ?
            "" :
            userFilter.filter(
                (obj) => symmetric[3][0]["user"] === obj["user_id"]
            )[0]["Địa chỉ"] + ",";
    }
    if (symmetric[3][0].arrayFalse.length !== 0) {
        listCaseIdbyTestId[currentIndex]["listUserGroupFalse"] +=
            symmetric[3].length === 0 ?
            "" :
            userFilter.filter(
                (obj) => symmetric[3][0]["user"] === obj["user_id"]
            )[0]["Nhóm"] + ",";
    }
    if (symmetric[3][0].arrayFalse.length !== 0) {
        listCaseIdbyTestId[currentIndex]["listUserTimeFalse"] +=
            symmetric[3].length === 0 ?
            "" :
            userFilter.filter(
                (obj) => symmetric[3][0]["user"] === obj["user_id"]
            )[0]["Số giờ"] + ",";
    }
    if (symmetric[3][0].arrayFalse.length !== 0) {
        listCaseIdbyTestId[currentIndex]["listUserExpFalse"] +=
            symmetric[3].length === 0 ?
            "" :
            userFilter.filter(
                (obj) => symmetric[3][0]["user"] === obj["user_id"]
            )[0]["Số năm kinh nghiệm"] + ",";
    }
}

function calcTruePercentofAnyLesionKDX(objRowData, objDapAn) {
    // tach thanh các testid, caseid
    // list data cua caseid tren (testid,caseid,listuser,totaltrue,total)
    // neu dung, listuser[], -> tong so luong
    if (objRowData.length == 0) {
        return;
    }
    objIndex = listCaseIdbyTestId.findIndex(
        (obj) =>
        obj.testId === objRowData[0]["test_id"] &&
        obj.caseId === objRowData[0]["case_id"] &&
        obj.lesionId === objRowData[0]["lesionID"] &&
        obj.type === "NonSymmetric"
    );
    if (objIndex == -1) {
        listCaseIdbyTestId.push({
            testId: objRowData[0]["test_id"],
            caseId: objRowData[0]["case_id"],
            lesionId: objRowData[0]["lesionID"],
            truthX: null,
            truthY: null,
            totalUserTruth: 0,
            totalUser: 0,
            listUserIdTrue: "",
            listUserAddressTrue: "",
            listUserGroupTrue: "",
            listUserTimeTrue: "",
            listUserExpTrue: "",
            listUserIdFalse: "",
            listUserAddressFalse: "",
            listUserGroupFalse: "",
            listUserTimeFalse: "",
            listUserExpFalse: "",
            listAge: "",
            listCaseDensity: "",
            listLesionType: "",
            type: "NonSymmetric",
            lesionSide: "",
            lesionSite: "",
            lesionSize: "",
        });
    }
    // const checkUser = userFilter
    //     .filter(obj => objRowData[0]["user_id"] === obj["user_id"])
    currentIndex = listCaseIdbyTestId.findIndex(
        (obj) =>
        obj.testId === objRowData[0]["test_id"] &&
        obj.caseId === objRowData[0]["case_id"] &&
        obj.lesionId === objRowData[0]["lesionID"] &&
        obj.type === "NonSymmetric"
    );

    let symmetric = calcNonSymmetric(objRowData, objDapAn);
    let listSysTrue = symmetric[2];
    let listSysFalse = symmetric[3];
    // console.log("LISTT", listSysTrue)

    // listCaseIdbyTestId[currentIndex]["totalUserTruth"] += symmetric[0];
    // listCaseIdbyTestId[currentIndex]["totalUser"] += symmetric[1];
    if (symmetric[0] > 0) {
        listCaseIdbyTestId[currentIndex]["totalUserTruth"] += 1;
    }
    if (symmetric[1] > 0) {
        listCaseIdbyTestId[currentIndex]["totalUser"] += 1;
    }

    if (symmetric[4] === null) {
        if (listCaseIdbyTestId[currentIndex]["listCaseDensity"] === "") {
            listCaseIdbyTestId[currentIndex]["listCaseDensity"] +=
                symmetric[5] === null ? "" : symmetric[5]["Case density"] + ",";
        }

        if (listCaseIdbyTestId[currentIndex]["listLesionType"] === "") {
            listCaseIdbyTestId[currentIndex]["listLesionType"] +=
                symmetric[5] === null ? "" : symmetric[5]["Lesion type"] + ",";
        }

        if (listCaseIdbyTestId[currentIndex]["listAge"] === "") {
            listCaseIdbyTestId[currentIndex]["listAge"] +=
                symmetric[5] === null ? "" : symmetric[5]["Tuổi"] + ",";
        }

        if (listCaseIdbyTestId[currentIndex]["lesionSide"] === "") {
            listCaseIdbyTestId[currentIndex]["lesionSide"] +=
                symmetric[5] === null ? "" : symmetric[5]["Lesion side"] + ",";
        }

        if (listCaseIdbyTestId[currentIndex]["lesionSite"] === "") {
            listCaseIdbyTestId[currentIndex]["lesionSite"] +=
                symmetric[5] === null ? "" : symmetric[5]["Lesion site"] + ",";
        }

        if (listCaseIdbyTestId[currentIndex]["lesionSize"] === "") {
            listCaseIdbyTestId[currentIndex]["lesionSize"] +=
                symmetric[5] === null ? "" : symmetric[5]["Lesion size (mm)"] + ",";
        }
    } else if (symmetric[5] === null) {
        if (listCaseIdbyTestId[currentIndex]["listCaseDensity"] === "") {
            listCaseIdbyTestId[currentIndex]["listCaseDensity"] +=
                symmetric[4] === null ? "" : symmetric[4]["Case density"] + ",";
        }

        if (listCaseIdbyTestId[currentIndex]["listLesionType"] === "") {
            listCaseIdbyTestId[currentIndex]["listLesionType"] +=
                symmetric[4] === null ? "" : symmetric[4]["Lesion type"] + ",";
        }

        if (listCaseIdbyTestId[currentIndex]["listAge"] === "") {
            listCaseIdbyTestId[currentIndex]["listAge"] +=
                symmetric[4] === null ? "" : symmetric[4]["Tuổi"] + ",";
        }

        if (listCaseIdbyTestId[currentIndex]["lesionSide"] === "") {
            listCaseIdbyTestId[currentIndex]["lesionSide"] +=
                symmetric[4] === null ? "" : symmetric[4]["Lesion side"] + ",";
        }

        if (listCaseIdbyTestId[currentIndex]["lesionSite"] === "") {
            listCaseIdbyTestId[currentIndex]["lesionSite"] +=
                symmetric[4] === null ? "" : symmetric[4]["Lesion site"] + ",";
        }

        if (listCaseIdbyTestId[currentIndex]["lesionSize"] === "") {
            listCaseIdbyTestId[currentIndex]["lesionSize"] +=
                symmetric[4] === null ? "" : symmetric[4]["Lesion size (mm)"] + ",";
        }
    }

    listCaseIdbyTestId[currentIndex]["listUserIdTrue"] +=
        symmetric[2].length == 0 ? "" : symmetric[2][0]["user"] + ",";
    if (symmetric[3][0].arrayFalse.length !== 0) {
        listCaseIdbyTestId[currentIndex]["listUserIdFalse"] +=
            symmetric[3].length == 0 ? "" : symmetric[3][0]["user"] + ",";
    }
    // listCaseIdbyTestId[currentIndex]["listUserIdTrue"] += (symmetric[2].length === 0) ? '' : symmetric[2][0]["user_id"] + ",";

    // if (symmetric[3][0].arrayFalse.length !== 0) {
    //     listCaseIdbyTestId[currentIndex]["listUserIdFalse"] += (symmetric[3].length === 0) ? '' : symmetric[3][0]["user_id"] + ",";
    // }

    listCaseIdbyTestId[currentIndex]["listUserAddressTrue"] +=
        symmetric[2].length == 0 ?
        "" :
        userFilter.filter(
            (obj) => symmetric[2][0]["user"] === obj["user_id"]
        )[0]["Địa chỉ"] + ",";
    listCaseIdbyTestId[currentIndex]["listUserGroupTrue"] +=
        symmetric[2].length == 0 ?
        "" :
        userFilter.filter(
            (obj) => symmetric[2][0]["user"] === obj["user_id"]
        )[0]["Nhóm"] + ",";
    listCaseIdbyTestId[currentIndex]["listUserTimeTrue"] +=
        symmetric[2].length == 0 ?
        "" :
        userFilter.filter(
            (obj) => symmetric[2][0]["user"] === obj["user_id"]
        )[0]["Số giờ"] + ",";
    listCaseIdbyTestId[currentIndex]["listUserExpTrue"] +=
        symmetric[2].length == 0 ?
        "" :
        userFilter.filter(
            (obj) => symmetric[2][0]["user"] === obj["user_id"]
        )[0]["Số năm kinh nghiệm"] + ",";

    if (symmetric[3][0].arrayFalse.length !== 0) {
        listCaseIdbyTestId[currentIndex]["listUserAddressFalse"] +=
            symmetric[3].length == 0 ?
            "" :
            userFilter.filter(
                (obj) => symmetric[3][0]["user"] === obj["user_id"]
            )[0]["Địa chỉ"] + ",";
    }
    if (symmetric[3][0].arrayFalse.length !== 0) {
        listCaseIdbyTestId[currentIndex]["listUserGroupFalse"] +=
            symmetric[3].length == 0 ?
            "" :
            userFilter.filter(
                (obj) => symmetric[3][0]["user"] === obj["user_id"]
            )[0]["Nhóm"] + ",";
    }
    if (symmetric[3][0].arrayFalse.length !== 0) {
        listCaseIdbyTestId[currentIndex]["listUserTimeFalse"] +=
            symmetric[3].length == 0 ?
            "" :
            userFilter.filter(
                (obj) => symmetric[3][0]["user"] === obj["user_id"]
            )[0]["Số giờ"] + ",";
    }
    if (symmetric[3][0].arrayFalse.length !== 0) {
        listCaseIdbyTestId[currentIndex]["listUserExpFalse"] +=
            symmetric[3].length == 0 ?
            "" :
            userFilter.filter(
                (obj) => symmetric[3][0]["user"] === obj["user_id"]
            )[0]["Số năm kinh nghiệm"] + ",";
    }
}
//// TINH TOAN LIST R
function calcR(rawData, dapAn) {
    count = 0;
    var maxRating = 0;
    tempRating = 0;
    check = 0;
    var checkNormalAbNormal = "Normal";
    dapAn.forEach((item) => {
        if (item["Case Type"] === "Abnormal") {
            checkNormalAbNormal = "Abnormal";
        }
    });

    if (checkNormalAbNormal == "Normal") {
        rawData.forEach((element) => {
            if (element["rating"] == 2 || element["rating"] == 1) {
                switch (rateConfig) {
                    case "1":
                        tempRating = 1;
                        break;
                    case "2":
                        tempRating = element["rating"];
                        break;
                }
            } else tempRating = element["rating"];
            if (tempRating > maxRating) {
                maxRating = parseInt(tempRating);
            }
        });
    } else {
        rawData.forEach((element) => {
            if (element["selectX"] > 0 && element["selectY"] > 0) {
                switch (rateConfig) {
                    case "1":
                        if (element["rating"] >= 3) {
                            if (element["rating"] > tempRating) {
                                tempRating = element["rating"];
                            }
                        }
                        break;
                    case "2":
                        if (element["rating"] >= 2) {
                            if (element["rating"] > tempRating) {
                                tempRating = element["rating"];
                            }
                        }
                        break;
                }
            }
            if (tempRating > 1) maxRating = parseInt(tempRating);
            else maxRating = 1;
        });

        if (isCaseDensity == true) {
            maxRating = countDensityRJRFR > 0 ? maxRating : 1;
        }

        if (isLessionType == true) {
            maxRating = countLesionR > 0 ? maxRating : 1;
        }
    }

    objIndex = listFrame.findIndex(
        (obj) =>
        obj.testId == rawData[0]["test_id"] &&
        obj.userId == rawData[0]["user_id"] &&
        obj.caseId == rawData[0]["case_id"] &&
        obj.type == checkNormalAbNormal
    );
    if (objIndex == -1) {
        listFrame.push({
            testId: rawData[0]["test_id"],
            userId: rawData[0]["user_id"],
            type: checkNormalAbNormal,
            caseId: rawData[0]["case_id"],
            rating: maxRating,
        });
    }
}

//// CALCULATE LIST JR
function calcJRNonSymmetric(rawData, dapAn) {
    var checkLesion = [];
    var checkNormalAbNormal;
    count = 0;
    maxRating = 0;
    tempRating = 0;
    check = 0;
    totalLession = 0;
    totalNormal = 0;
    checkNormalAbNormal = "Normal";
    dapAn.forEach((item) => {
        if (item["Case Type"] === "Abnormal") {
            checkNormalAbNormal = "Abnormal";
        }
    });

    if (checkNormalAbNormal == "Abnormal") {
        for (var i = 0; i < dapAn.length; i++) {
            const check = rawData
                .filter(
                    (obj) =>
                    dapAn[i]["Test set"] === obj["test_id"] &&
                    dapAn[i]["Case ID"] === obj["case_id"] &&
                    dapAn[i]["Lesion ID"] === obj["lesionID"] &&
                    obj["distance"] > 0 &&
                    (isCaseDensity ? countDensityRJRFR > 0 : true) &&
                    (isLessionType ?
                        checkLesionType(
                            dapAn[i]["Lesion type"],
                            obj["Lesion type(User)"]
                        ) === true :
                        true)
                )
                .map((obj) => obj);
            if (check.length > 0) {
                commonIncreaseJR(
                    check,
                    rawData,
                    dapAn[i],
                    listFrameJRNonSymmetric,
                    checkNormalAbNormal,
                    true
                );
            } else {
                commonIncreaseJR(
                    check,
                    rawData,
                    dapAn[i],
                    listFrameJRNonSymmetric,
                    checkNormalAbNormal,
                    false
                );
            }
        }
    } else {
        totalNormal = 1;
        rawData.forEach((element) => {
            if (element["rating"] == 2 || element["rating"] == 1) {
                switch (rateConfig) {
                    case "1":
                        tempRating = 1;
                        break;

                    case "2":
                        tempRating = element["rating"];
                        break;
                }
            } else tempRating = element["rating"];
            if (tempRating >= maxRating) {
                maxRating = parseInt(tempRating);
            }
        });
        objIndex = listFrameJRNonSymmetric.findIndex(
            (obj) =>
            obj.testId === rawData[0]["test_id"] &&
            obj.userId === rawData[0]["user_id"] &&
            obj.caseId == rawData[0]["case_id"] &&
            obj.type === checkNormalAbNormal
        );
        if (objIndex == -1) {
            listFrameJRNonSymmetric.push({
                testId: rawData[0]["test_id"],
                userId: rawData[0]["user_id"],
                type: checkNormalAbNormal,
                totalLesion: totalLession,
                totalNormal: totalNormal,
                caseId: rawData[0]["case_id"],
                rating: maxRating,
            });
        }
    }
}

function calcJRSymmetric(rawData, dapAn) {
    var countAnswer = 0;
    var countTotal = 0;
    var checkXY = [];
    var checkTruthXY = [];
    var checkFrame = [];
    var checkNormalAbNormal;
    count = 0;
    maxRating = 0;
    tempRating = 0;
    check = 0;
    totalLession = 0;
    totalNormal = 0;
    checkNormalAbNormal = "Normal";
    dapAn.forEach((item) => {
        if (item["Case Type"] === "Abnormal") {
            checkNormalAbNormal = "Abnormal";
        }
    });
    // ABNORMAL
    if (checkNormalAbNormal == "Abnormal") {
        const uniqueLesionId = [
            ...new Set(
                rawData.map(
                    (item) =>
                    item["test_id"] +
                    ":" +
                    item["user_id"] +
                    ":" +
                    item["case_id"] +
                    ":" +
                    item["frame"] +
                    ":" +
                    item["slide"]
                )
            ),
        ];
        for (var i = 0; i < dapAn.length; i++) {
            const check = rawData
                .filter(
                    (obj) =>
                    dapAn[i]["Test set"] === obj["test_id"] &&
                    dapAn[i]["Case ID"] === obj["case_id"] &&
                    dapAn[i]["Lesion ID"] === obj["lesionID"] &&
                    dapAn[i]["TruthX"] === obj["truthX"] &&
                    dapAn[i]["TruthY"] === obj["truthY"] &&
                    obj["distance"] > 0 &&
                    (isCaseDensity ? countDensityRJRFR > 0 : true) &&
                    (isLessionType ?
                        checkLesionType(
                            dapAn[i]["Lesion type"],
                            obj["Lesion type(User)"]
                        ) === true :
                        true)
                )
                .map((obj) => obj);

            if (check.length > 0) {
                commonIncreaseJRSymmetric(
                    check,
                    rawData,
                    dapAn[i],
                    listFrameJRSymmetric,
                    checkNormalAbNormal,
                    true
                );
            } else {
                commonIncreaseJRSymmetric(
                    check,
                    rawData,
                    dapAn[i],
                    listFrameJRSymmetric,
                    checkNormalAbNormal,
                    false
                );
            }
        }
    }
    // NORMAL
    else {
        totalNormal = 1;
        rawData.forEach((element) => {
            if (element["rating"] == 2) {
                switch (rateConfig) {
                    case "1":
                        tempRating = 1;
                        break;

                    case "2":
                        tempRating = element["rating"];
                        break;
                }
            } else tempRating = element["rating"];
            if (tempRating > maxRating) {
                maxRating = parseInt(tempRating);
            }
        });

        objIndex = listFrameJRSymmetric.findIndex(
            (obj) =>
            obj.testId === rawData[0]["test_id"] &&
            obj.userId === rawData[0]["user_id"] &&
            obj.caseId == rawData[0]["case_id"] &&
            obj.type === checkNormalAbNormal
        );
        if (objIndex == -1) {
            listFrameJRSymmetric.push({
                testId: rawData[0]["test_id"],
                userId: rawData[0]["user_id"],
                type: checkNormalAbNormal,
                totalLesion: 1,
                totalNormal: 1,
                caseId: rawData[0]["case_id"],
                rating: maxRating,
            });
        }
    }
}

// Calculate LIST FR
function calcFR(rawData, dapAn) {
    var checkNormalAbNormal;
    count = 0;
    let maxRating = 1;
    tempRating = 0;
    check = 0;
    totalLesion = 0;
    totalNormal = 0;
    listRate = [];
    listTotalRate = [];
    checkNormalAbNormal = "Normal";
    dapAn.forEach((item) => {
        if (item["Case Type"] === "Abnormal") {
            checkNormalAbNormal = "Abnormal";
        }
    });

    if (checkNormalAbNormal == "Abnormal") {
        totalLesion = 1;
        for (var i = 0; i < rawData.length; i++) {
            switch (rateConfig) {
                case "1":
                    if (rawData[i]["rating"] >= 3) {
                        listTotalRate.push(rawData[i]["rating"]);
                        dapAn.forEach(function(caseDapAn) {
                            if (
                                rawData[i]["lesionID"] === caseDapAn["Lesion ID"] &&
                                rawData[i]["distance"] > 0 &&
                                (isCaseDensity ? countDensityRJRFR > 0 : true) &&
                                (isLessionType ?
                                    checkLesionType(
                                        caseDapAn["Lesion type"],
                                        rawData[i]["Lesion type(User)"]
                                    ) === true :
                                    true)
                            ) {
                                if (maxRating < rawData[i]["rating"]) {
                                    maxRating = parseInt(rawData[i]["rating"]);
                                }
                            }
                        });
                    }
                    break;

                case "2":
                    if (rawData[i]["rating"] >= 2) {
                        listTotalRate.push(rawData[i]["rating"]);
                        dapAn.forEach(function(caseDapAn) {
                            if (
                                rawData[i]["lesionID"] === caseDapAn["Lesion ID"] &&
                                rawData[i]["distance"] > 0 &&
                                (isCaseDensity ? countDensityRJRFR > 0 : true) &&
                                (isLessionType ?
                                    checkLesionType(
                                        caseDapAn["Lesion type"],
                                        rawData[i]["Lesion type(User)"]
                                    ) === true :
                                    true)
                            ) {
                                if (maxRating < rawData[i]["rating"]) {
                                    maxRating = parseInt(rawData[i]["rating"]);
                                }
                            }
                        });
                    }
                    break;
            }
        }

        if (maxRating < Math.max(...listTotalRate)) {
            maxRating = 1;
        }
        objIndex = listFrameFR.findIndex(
            (obj) =>
            obj.testId === rawData[0]["test_id"] &&
            obj.userId === rawData[0]["user_id"] &&
            obj.caseId == rawData[0]["case_id"] &&
            obj.type === checkNormalAbNormal
        );
        if (objIndex == -1) {
            listFrameFR.push({
                testId: rawData[0]["test_id"],
                userId: rawData[0]["user_id"],
                type: checkNormalAbNormal,
                totalLesion: 1,
                totalNormal: 0,
                caseId: rawData[0]["case_id"],
                rating: maxRating,
            });
        } else {
            if (
                parseInt(rawData["rating"]) > parseInt(listFrame[objIndex]["rating"]) &&
                parseInt(rawData["rating"]) != 2
            ) {
                listFrame[objIndex]["rating"] = parseInt(rawData["rating"]);
            }
        }
    } else {
        totalNormal = 1;
        rawData.forEach((element) => {
            if (element["rating"] == 2) {
                switch (rateConfig) {
                    case "1":
                        tempRating = 1;
                        break;

                    case "2":
                        tempRating = element["rating"];
                        break;
                }
            } else tempRating = element["rating"];
            if (tempRating > maxRating) {
                maxRating = parseInt(tempRating);
            }
        });
        objIndex = listFrameFR.findIndex(
            (obj) =>
            obj.testId === rawData[0]["test_id"] &&
            obj.userId === rawData[0]["user_id"] &&
            obj.caseId == rawData[0]["case_id"] &&
            obj.type === checkNormalAbNormal
        );
        if (objIndex == -1) {
            listFrameFR.push({
                testId: rawData[0]["test_id"],
                userId: rawData[0]["user_id"],
                type: checkNormalAbNormal,
                totalLesion: 0,
                totalNormal: 1,
                caseId: rawData[0]["case_id"],
                rating: maxRating,
            });
        }
    }
}

function checkProbabilityRating(listFrame, type) {
    const uniqueTestUser = [
        ...new Set(listFrame.map((item) => item["testId"] + "," + item["userId"])),
    ];

    var totalLesion = 0,
        totalNormal = 0;
    uniqueTestUser.forEach((unique) => {
        const checkAnyFrame = listFrame
            .filter(
                (obj) =>
                obj["testId"] === unique.split(",")[0] &&
                obj["userId"] === unique.split(",")[1]
            )
            .map((obj) => obj);
        var totalNormal = 0,
            totalAbNormal = 0;
        var n_minus_1 = 0,
            n_plus_1 = 0,
            n_than_1 = 0;
        var n_minus_2 = 0,
            n_plus_2 = 0,
            n_than_2 = 0;
        var n_minus_3 = 0,
            n_plus_3 = 0,
            n_than_3 = 0;
        var n_minus_4 = 0,
            n_plus_4 = 0,
            n_than_4 = 0;
        var n_minus_5 = 0,
            n_plus_5 = 0,
            n_than_5 = 0;
        var totalLesion = 0,
            totalNormalAnswer = 0;
        // CHECK ANY FRAME
        for (var i = 0; i < checkAnyFrame.length; i++) {
            totalLesion += checkAnyFrame[i].totalLesion;
            totalNormalAnswer += checkAnyFrame[i].totalNormal;
            (n_minus_X = 0), (n_plus_x = 0), (n_than_x = 0);
            if (checkAnyFrame[i].type == "Normal") {
                totalNormal++;
                switch (parseInt(checkAnyFrame[i].rating)) {
                    case 1:
                        n_minus_1++;
                        break;
                    case 2:
                        n_minus_2++;
                        break;
                    case 3:
                        n_minus_3++;
                        break;
                    case 4:
                        n_minus_4++;
                        break;
                    case 5:
                        n_minus_5++;
                        break;
                }
            } else {
                totalAbNormal++;
                switch (parseInt(checkAnyFrame[i].rating)) {
                    case 1:
                        n_plus_1++;
                        if (checkAnyFrame[i]["userId"] === "adel01" && type == "R") {
                            console.log("USERRRR", checkAnyFrame[i]["userId"]);
                            console.log("CHECKKK N PLUSH", n_plus_1);
                        }
                        break;
                    case 2:
                        n_plus_2++;
                        n_than_1++;
                        break;
                    case 3:
                        n_plus_3++;
                        n_than_2++;
                        n_than_1++;
                        break;
                    case 4:
                        n_plus_4++;
                        n_than_3++;
                        n_than_2++;
                        n_than_1++;
                        break;
                    case 5:
                        n_plus_5++;
                        n_than_4++;
                        n_than_3++;
                        n_than_2++;
                        n_than_1++;
                        break;
                }
            }
        }
        var prop =
            n_minus_1 * n_than_1 +
            n_minus_1 * n_plus_1 +
            n_minus_2 * n_than_2 +
            n_minus_2 * n_plus_2 +
            n_minus_3 * n_than_3 +
            n_minus_3 * n_plus_3 +
            n_minus_4 * n_than_4 +
            n_minus_4 * n_plus_4 +
            n_minus_5 * n_than_5 +
            n_minus_5 * n_plus_5;
        if (type == "R") {
            //console.log("CASE R")
            // console.log(n_minus_1 + " - " + n_plus_1 + " - " + n_than_1)
            // console.log(n_minus_2 + " - " + n_plus_2 + " - " + n_than_2)
            // console.log(n_minus_3 + " - " + n_plus_3 + " - " + n_than_3)
            // console.log(n_minus_4 + " - " + n_plus_4 + " - " + n_than_4)
            // console.log(n_minus_5 + " - " + n_plus_5 + " - " + n_than_5)
            // console.log("TOTAL NORMAL", totalNormal)
            // console.log("TOTAL ABNORMAL", totalAbNormal)
            // console.log("Percen %", prop / (totalNormal * totalAbNormal))
            listExportN1toN5_R.push({
                userId: unique.split(",")[1],
                a: n_minus_1,
                b: n_plus_1,
                c: n_than_1,
            }, {
                userId: "",
                a: n_minus_2,
                b: n_plus_2,
                c: n_than_2,
            }, {
                userId: "",
                a: n_minus_3,
                b: n_plus_3,
                c: n_than_3,
            }, {
                userId: "",
                a: n_minus_4,
                b: n_plus_4,
                c: n_than_4,
            }, {
                userId: "",
                a: n_minus_5,
                b: n_plus_5,
                c: n_than_5,
            });

            listR.push({
                testId: unique.split(",")[0],
                userId: unique.split(",")[1],
                sessionNo: "",
                listCaseIdTrue: "",
                listCaseIdFalse: "",
                percentType: "R",
                percent: prop / (totalAbNormal * totalNormal),
                numberCaseTrue: "",
                totalCase: "",
                listAge: "",
            });
        } else if (type == "JRDX") {
            // console.log("Case JR DOI XUNG")
            // console.log(n_minus_1 + " - " + n_plus_1 + " - " + n_than_1)
            // console.log(n_minus_2 + " - " + n_plus_2 + " - " + n_than_2)
            // console.log(n_minus_3 + " - " + n_plus_3 + " - " + n_than_3)
            // console.log(n_minus_4 + " - " + n_plus_4 + " - " + n_than_4)
            // console.log(n_minus_5 + " - " + n_plus_5 + " - " + n_than_5)
            // console.log("TOTAL NORMAL", totalNormal)
            // console.log("TOTAL ABNORMAL", totalAbNormal)
            // console.log("Percen %", prop / (totalNormal * totalAbNormal))
            listExportN1toN5_JRDX.push({
                userId: unique.split(",")[1],
                a: n_minus_1,
                b: n_plus_1,
                c: n_than_1,
            }, {
                userId: "",
                a: n_minus_2,
                b: n_plus_2,
                c: n_than_2,
            }, {
                userId: "",
                a: n_minus_3,
                b: n_plus_3,
                c: n_than_3,
            }, {
                userId: "",
                a: n_minus_4,
                b: n_plus_4,
                c: n_than_4,
            }, {
                userId: "",
                a: n_minus_5,
                b: n_plus_5,
                c: n_than_5,
            });
            listJRSymmetric.push({
                testId: unique.split(",")[0],
                userId: unique.split(",")[1],
                sessionNo: "",
                listCaseIdTrue: "",
                listCaseIdFalse: "",
                percentType: "JRDX",
                percent: prop / (totalNormal * totalAbNormal),
                numberCaseTrue: "",
                totalCase: "",
                listAge: "",
            });
        } else if (type == "JRKDX") {
            // console.log("Case JR KDX")
            // console.log(n_minus_1 + " - " + n_plus_1 + " - " + n_than_1)
            // console.log(n_minus_2 + " - " + n_plus_2 + " - " + n_than_2)
            // console.log(n_minus_3 + " - " + n_plus_3 + " - " + n_than_3)
            // console.log(n_minus_4 + " - " + n_plus_4 + " - " + n_than_4)
            // console.log(n_minus_5 + " - " + n_plus_5 + " - " + n_than_5)
            // console.log("TOTAL NORMAL", totalNormal)
            // console.log("TOTAL ABNORMAL", totalAbNormal)
            // console.log("Percen %", prop / (totalNormal * totalAbNormal))
            listExportN1toN5_JRKDX.push({
                userId: unique.split(",")[1],
                a: n_minus_1,
                b: n_plus_1,
                c: n_than_1,
            }, {
                userId: "",
                a: n_minus_2,
                b: n_plus_2,
                c: n_than_2,
            }, {
                userId: "",
                a: n_minus_3,
                b: n_plus_3,
                c: n_than_3,
            }, {
                userId: "",
                a: n_minus_4,
                b: n_plus_4,
                c: n_than_4,
            }, {
                userId: "",
                a: n_minus_5,
                b: n_plus_5,
                c: n_than_5,
            });
            listJRNonSymmetric.push({
                testId: unique.split(",")[0],
                userId: unique.split(",")[1],
                sessionNo: "",
                listCaseIdTrue: "",
                listCaseIdFalse: "",
                percentType: "JRKDX",
                percent: prop / (totalNormal * totalAbNormal),
                numberCaseTrue: "",
                totalCase: "",
                listAge: "",
            });
        } else if (type == "FR") {
            // console.log("Case FR ")
            // console.log(n_minus_1 + " - " + n_plus_1 + " - " + n_than_1)
            // console.log(n_minus_2 + " - " + n_plus_2 + " - " + n_than_2)
            // console.log(n_minus_3 + " - " + n_plus_3 + " - " + n_than_3)
            // console.log(n_minus_4 + " - " + n_plus_4 + " - " + n_than_4)
            // console.log(n_minus_5 + " - " + n_plus_5 + " - " + n_than_5)
            // console.log("TOTAL NORMAL", totalNormal)
            // console.log("TOTAL ABNORMAL", totalAbNormal)
            // console.log("Percen %", prop / (totalNormal * totalAbNormal))
            listExportN1toN5_FR.push({
                userId: unique.split(",")[1],
                a: n_minus_1,
                b: n_plus_1,
                c: n_than_1,
            }, {
                userId: "",
                a: n_minus_2,
                b: n_plus_2,
                c: n_than_2,
            }, {
                userId: "",
                a: n_minus_3,
                b: n_plus_3,
                c: n_than_3,
            }, {
                userId: "",
                a: n_minus_4,
                b: n_plus_4,
                c: n_than_4,
            }, {
                userId: "",
                a: n_minus_5,
                b: n_plus_5,
                c: n_than_5,
            });
            listFR.push({
                testId: unique.split(",")[0],
                userId: unique.split(",")[1],
                sessionNo: "",
                listCaseIdTrue: "",
                listCaseIdFalse: "",
                percentType: "FR",
                percent: prop / (totalNormal * totalAbNormal),
                numberCaseTrue: "",
                totalCase: "",
                listAge: "",
            });
        }
    });
}

function commonIncreaseJR(
    check,
    rawData,
    dapAn,
    listFrame,
    checkNormalAbNormal,
    status
) {
    let totalNormal = 1;
    let maxRating = 1;
    if (status) {
        check.forEach((element) => {
            if (parseInt(element["rating"]) > maxRating) {
                maxRating = parseInt(element["rating"]);
            }
        });
    } else {
        maxRating = 1;
    }
    switch (rateConfig) {
        case "1":
            maxRating = maxRating == 2 ? 1 : maxRating;
            break;

        default:
            break;
    }
    objIndex = listFrame.findIndex(
        (obj) =>
        obj.testId === rawData[0]["test_id"] &&
        obj.userId === rawData[0]["user_id"] &&
        obj.caseId == rawData[0]["case_id"] &&
        obj.lesionID == dapAn["Lesion ID"] &&
        obj.type === checkNormalAbNormal
    );
    if (objIndex == -1) {
        listFrame.push({
            testId: rawData[0]["test_id"],
            userId: rawData[0]["user_id"],
            type: checkNormalAbNormal,
            totalLesion: 1,
            totalNormal: 1,
            lesionID: dapAn["Lesion ID"],
            caseId: rawData[0]["case_id"],
            rating: maxRating,
        });
    } else {
        switch (rateConfig) {
            case "1":
                if (
                    maxRating > parseInt(listFrame[objIndex]["rating"]) &&
                    maxRating != 2
                ) {
                    listFrame[objIndex]["rating"] = maxRating;
                }
                break;

            case "2":
                if (maxRating > parseInt(listFrame[objIndex]["rating"])) {
                    listFrame[objIndex]["rating"] = maxRating;
                }
                break;
        }
    }
}

function commonIncreaseJRSymmetric(
    check,
    rawData,
    dapAn,
    listFrame,
    checkNormalAbNormal,
    status
) {
    let totalNormal = 1;
    let maxRating = 1;
    if (status) {
        check.forEach((element) => {
            if (parseInt(element["rating"]) > maxRating) {
                maxRating = parseInt(element["rating"]);
            }
        });
    } else {
        maxRating = 1;
    }
    switch (rateConfig) {
        case "1":
            maxRating = maxRating == 2 ? 1 : maxRating;
            break;

        default:
            break;
    }

    objIndex = listFrame.findIndex(
        (obj) =>
        obj.testId === rawData[0]["test_id"] &&
        obj.userId === rawData[0]["user_id"] &&
        obj.caseId == rawData[0]["case_id"] &&
        obj.checkDuplicate ===
        dapAn["TruthX"] + "-" + dapAn["TruthY"] + "-" + dapAn["Lesion ID"]
    );
    if (objIndex == -1) {
        listFrame.push({
            testId: rawData[0]["test_id"],
            userId: rawData[0]["user_id"],
            type: checkNormalAbNormal,
            totalLesion: 1,
            totalNormal: 1,
            lesionID: dapAn["Lesion ID"],
            caseId: rawData[0]["case_id"],
            rating: maxRating,
            checkDuplicate: dapAn["TruthX"] + "-" + dapAn["TruthY"] + "-" + dapAn["Lesion ID"],
        });
    } else {
        switch (rateConfig) {
            case "1":
                if (
                    maxRating > parseInt(listFrame[objIndex]["rating"]) &&
                    maxRating != 2
                ) {
                    listFrame[objIndex]["rating"] = maxRating;
                }
                break;

            case "2":
                if (maxRating > parseInt(listFrame[objIndex]["rating"])) {
                    listFrame[objIndex]["rating"] = maxRating;
                }
                break;
        }
    }
}