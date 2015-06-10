//Create new DB
var db = new PouchDB('Vauchers5');

//Extracting values from the form and putting them to variables
function addVaucher() {
    var vaucherID = window.document.VaucherForm.vaucherID.value;
    var date = window.document.VaucherForm.date.value;
    var invoiceNumber = window.document.VaucherForm.invoiceNumber.value;
    var vendorID = window.document.VaucherForm.vendorID.value;
    var amount = window.document.VaucherForm.amount.value;
    var fund = window.document.VaucherForm.fund.value;
    var deptID = window.document.VaucherForm.deptID.value;
    var descript =  window.document.VaucherForm.descript.value;

    //Creating an object (vaucher) and writing data in it
    var vaucher = {
        _id: new Date().toISOString(),
        vaucherID: vaucherID,
        date: date,
        invoiceNumber: invoiceNumber,
        vendorID: vendorID,
        amount: amount,
        fund: fund,
        deptID: deptID,
        descript: descript
    };
    //put vaucher info into DB
    db.put(vaucher, function callback(error, result) {
        if (!error) {
            clearFields(vaucherID);
            showVauchers();
            console.log("Vaucher has been added successfully");
        }
    });
}

var setVaucherID=''; 
var setDate=''; 
var setInvoiceNumber=''; 
var setVendorID=''; 
var setAmount=''; 
var setFund=''; 
var setDeptID=''; 
var setDescription=''; 

//Saving Form Settings into variables
function saveSet() {
    setVaucherID = document.getElementById('setVaucherID').value;
    setDate = document.getElementById('setDate').value;
    setInvoiceNumber = document.getElementById('setInvoiceNumber').value;
    setVendorID = document.getElementById('setVendorID').value;
    setAmount = document.getElementById('setAmount').value;
    setFund = document.getElementById('setFund').value;
    setDeptID = document.getElementById('setDeptID').value;
    setDescription =  document.getElementById('setDescription').value;
    n =  document.getElementById('rows').value;
}

//Clear fields is called after the form is submitted
function clearFields(vaucherID) {  
    saveSet();
    var today = new Date();
    var dd = today.getDate();
    var mm = today.getMonth()+1; //January is 0!
    var yyyy = today.getFullYear();
    if(dd<10) { dd='0'+dd} 
    if(mm<10) {mm='0'+mm} 
    today = yyyy+'-'+mm+'-'+dd; //getting toda's date
    
    //setting values in a new form
	// window.document.VaucherForm.vaucherID.value = Number(window.document.VaucherForm.vaucherID.value)+1;
	window.document.VaucherForm.date.value = today;
	window.document.VaucherForm.invoiceNumber.value = setInvoiceNumber;
	window.document.VaucherForm.vendorID.value = setVendorID;
	window.document.VaucherForm.amount.value = setAmount;
	window.document.VaucherForm.fund.value = setFund;
	window.document.VaucherForm.deptID.value = setDeptID;
    document.getElementById('descript').value = setDescription;
}

//Display table of vauchers, descending: true, at documnet load
 $(document).ready(function() 
 {
    db.allDocs( {include_docs: true, descending: true},
                function(err, doc) {
                    showTableOfVauchers(doc.rows);
                } );
    //Use clearFields() to get the date and Vendor ID 
    //in form from document load
    clearFields();
});

//Show Vauchers from DB
function showVauchers() {
    db.allDocs( {include_docs: true, descending: true},
                function(err, doc) {
                    showTableOfVauchers(doc.rows);
                } );
}

var j, idValue;

function updateVaucher(td){
    //Get the value of the cell of the row to be edited
    var mydoc = td.textContent;
    console.log(mydoc);
    //find the row
    for (i=1; i<n; i++){
        if ($('table tr:eq('+i+') td:eq(1)').text() == mydoc) {
            idValue = $('table tr:eq('+i+') td:eq(0)').text();
            j=i;
        }
    }
    console.log(idValue);
    //Put values from the table into the form
    window.document.VaucherForm.vaucherID.value = $('table tr:eq('+j+') td:eq(1)').text()
    window.document.VaucherForm.vendorID.value = $('table tr:eq('+j+') td:eq(2)').text()
    window.document.VaucherForm.amount.value = $('table tr:eq('+j+') td:eq(3)').text()
    window.document.VaucherForm.date.value = $('table tr:eq('+j+') td:eq(4)').text()
    window.document.VaucherForm.invoiceNumber.value = $('table tr:eq('+j+') td:eq(5)').text()
    window.document.VaucherForm.fund.value = $('table tr:eq('+j+') td:eq(6)').text()
    window.document.VaucherForm.deptID.value = $('table tr:eq('+j+') td:eq(7)').text()
    document.getElementById('descript').value = $('table tr:eq('+j+') td:eq(8)').text()

    //Delete from the DB
    idValue = idValue.toString();
    db.get(idValue).then(function(doc) {
      return db.remove(doc);
    }).then(function (result) {
      console.log("deleted seccessfuly")
    }).catch(function (err) {
      console.log(err);
    });
}


var n=50; //default number of vauchers to display in the table
var lastVaucherID=0;

//"Drawing" table of vauchers 
function showTableOfVauchers(data) {
    lastVaucherID=0;
    var div = document.getElementById("table");
    var str = "<table aligh='left' border='1' id='tableData'><tr><th>#</th>"+
            "<th>Vaucher ID</th><th>Vendor ID</th><th>Amount</th><th>Date</th><th>Invoice #</th><th>Fund</th><th>Dept ID</th><th>Description</th><th>Check</th></tr>";

    //Make sure table isn't longer then the number of rows in DB
    if (data.length<n)
    {n=data.length}
    

    for(var i=0; i<n; i++)
    {
        str +=  "<tr><td>"+data[i].doc._id+
                "</td><td ondblclick='updateVaucher(this)' style='cursor: pointer'>"+data[i].doc.vaucherID+
                "</td><td>"+data[i].doc.vendorID+
                "</td><td>"+data[i].doc.amount+
                "</td><td>"+data[i].doc.date+
                "</td><td>"+data[i].doc.invoiceNumber+           
                "</td><td>"+data[i].doc.fund+
                "</td><td>"+data[i].doc.deptID+
                "</td><td>"+data[i].doc.descript+
                "</td><td>"+ dateCheck(data[i].doc.date)+ //dateCheck() checks if the date==today and puts "checked"
                "</td></tr>"

                //Find the LastVaucherID (highest value)
                if(Number(lastVaucherID)<Number(data[i].doc.vaucherID)){
                    lastVaucherID=Number(data[i].doc.vaucherID);
                }
    }
    str += "</table>";
    div.innerHTML = str;


    //checks if the date==today and puts "checked"
    function dateCheck(date1){
        if (date1==today1){
            return "<input type='checkbox' checked value=1 />"
        }
        else {
            return "<input type='checkbox' value=0 />"
        }
    } 

    //Insert vaucher ID on load
    window.document.VaucherForm.vaucherID.value = Number(lastVaucherID)+1;
}
     

//Getting today's date 
var today = new Date();
var dd = today.getDate();
var mm = today.getMonth()+1; //January is 0!
var yyyy = today.getFullYear();

if(dd<10) {
    dd='0'+dd
} 
if(mm<10) {
    mm='0'+mm
} 
today = mm+'/'+dd+'/'+yyyy;
var today1= yyyy+'-'+mm+'-'+dd;
var fileName = "18I"+yyyy+mm+dd+".txt";


//VAUCHER SETTINGs ABOUT - displaying and hiding 

function vaucherEntry(){
    //Displays vaucher entry form and hides the rest
    document.getElementById("form").style.display = 'block';
    document.getElementById("setForm").style.display = 'none';
    document.getElementById("aboutText").style.display = 'none';
    document.getElementById("table").style.display = 'block';
    
    //Adds blue inner shadow on selected button
    document.getElementById("vaucherEntry").className = "selected";
    document.getElementById("settings").className = "normal";
    document.getElementById("about").className = "normal";
    
    //Changes vaucher entry image to blue and the rest to grey
    $('#leftColumn li:nth-child(1) img').attr('src','img/formBlue.png');
    $('#leftColumn li:nth-child(2) img').attr('src','img/setting.png');
    $('#leftColumn li:nth-child(3) img').attr('src','img/about.png');

    showVauchers();

}

function settings(){
    //Displays settings form and hides the rest
    document.getElementById("form").style.display = 'none';
    document.getElementById("setForm").style.display = 'block';
    document.getElementById("aboutText").style.display = 'none';
    document.getElementById("table").style.display = 'none';

    //Adds blue inner shadow on selected button
    document.getElementById("settings").className = "selected";
    document.getElementById("vaucherEntry").className = "normal";
    document.getElementById("about").className = "normal";
    
    //Changes settings image to blue and the rest to grey
    $('#leftColumn li:nth-child(1) img').attr('src','img/form.png');
    $('#leftColumn li:nth-child(2) img').attr('src','img/settingBlue.png');
    $('#leftColumn li:nth-child(3) img').attr('src','img/about.png');

}


function about(){
    //Displays about and hides the rest
    document.getElementById("form").style.display = 'none';
    document.getElementById("setForm").style.display = 'none';
    document.getElementById("aboutText").style.display = 'block';
    document.getElementById("table").style.display = 'none';

    //Adds blue inner shadow on selected button
    document.getElementById("settings").className = "normal";
    document.getElementById("vaucherEntry").className = "normal";
    document.getElementById("about").className = "selected";
    
    //Changes about image to blue and the rest to grey
    $('#leftColumn li:nth-child(1) img').attr('src','img/form.png');
    $('#leftColumn li:nth-child(2) img').attr('src','img/setting.png');
    $('#leftColumn li:nth-child(3) img').attr('src','img/aboutBlue.png');
}

    

var rowCount=1;
var details='';

function htmlToText(){
    // iterate over each of the <tr> elements within the
    // <tbody>, using the map() method:
    details = $('#tableData tbody tr').map(function (i, row) {

        // creating an Object to return:
        return {
            'number': row.cells[1].textContent,
            'vendorID': row.cells[2].textContent,
            'amount': row.cells[3].textContent,
            'date': row.cells[4].textContent,
            'invoiceNum': row.cells[5].textContent,
            'fund': row.cells[6].textContent,
            'deptID': row.cells[7].textContent,
            'description': row.cells[8].textContent,
            'checkBox': $('#tableData tbody tr:eq('+row+')').find('td:eq(9) input').is(':checked')
        }
    // converting the map into an Array:
    }).get();

    // console.log(details);
}


var fileContents = '';
var number, vendorID, amount, date, invoiceNum, fund, deptID, description;
//var rowCount = $('#table tbody tr').length
var rowCount = $('#table tbody tr').length;
// details[2].vendorID
var i;

//Writing all the values into fileContents variable
function text(){
    fileContents = '';
    rowCount = $('#table tbody tr').length;
    for (i=1; i<rowCount; i++){
        number = details[i].number.toString();
        vendorID = details[i].vendorID.toString();
        amount = details[i].amount.toString();
        date = details[i].date.toString();
        //origianly date is like this: mm-dd-yyyy, ant it has to be like this: ddmmyyyy 
        //replace "-" in date with ""
        date = date.replace(/-/g,''); 
        invoiceNum = details[i].invoiceNum.toString();
        fund = details[i].fund.toString();
        deptID = details[i].deptID.toString();
        description = details[i].description.toString();

        //Adding spaces at the end of the value to match certain width
        if ($('#tableData tbody tr:eq('+i+')').find('td:eq(9) input').is(':checked')){
            while (number.length<8) {number = number + ' ';}
            while (vendorID.length<10) {vendorID = vendorID + ' ';}
            while (amount.length<17) {amount = amount + ' ';}
            while (date.length<10) {date = date + ' ';}
            while (invoiceNum.length<28) {invoiceNum = invoiceNum + ' ';}
            while (fund.length<5) {fund = fund + ' ';}
            while (deptID.length<7) {deptID = deptID + ' ';}
            while (description.length<30) {description = description + ' ';}

            fileContents = fileContents + number + vendorID + amount + date + invoiceNum + fund + deptID + "3700  " + description+"\n";
        }
        else {console.log('this line is unchecked');}    
    }
}

//Bounces and changes to blue little arrow next save as button
function bounce(){
    $('#leftColumn li:nth-child(4) img').hide();
    $('#leftColumn li:nth-child(4) img').attr('src','img/savefileBlue.png');
    $('#leftColumn li:nth-child(4) img').show('linear');
    //Returns to grey the image
    setTimeout(function() {
        $('#leftColumn li:nth-child(4) img').attr('src','img/savefile.png');
      }, 1000 );
    };

//Fires when you click Save File
function logFile(){
    htmlToText();
    text();
    saveTextAsFile();
    bounce();
    console.log(fileContents);
    console.log("File name is: " + fileName);
}

//SAVE File to txt file
function saveTextAsFile()
{
    var textToWrite = fileContents;
    var textFileAsBlob = new Blob([textToWrite], {type:'text/plain'});
    var fileNameToSaveAs = fileName;

    var downloadLink = document.createElement("a");
    downloadLink.download = fileName;
    downloadLink.innerHTML = "Download File";
    if (window.webkitURL != null)
    {
        // Chrome allows the link to be clicked
        // without actually adding it to the DOM.
        downloadLink.href = window.webkitURL.createObjectURL(textFileAsBlob);
    }
    else
    {
        // Firefox requires the link to be added to the DOM
        // before it can be clicked.
        downloadLink.href = window.URL.createObjectURL(textFileAsBlob);
        downloadLink.onclick = destroyClickedElement;
        downloadLink.style.display = "none";
        document.body.appendChild(downloadLink);
    }

    downloadLink.click();
}

function destroyClickedElement(event)
{
    document.body.removeChild(event.target);
}