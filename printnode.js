const axios = require('axios');
const Base64 = require('js-base64').Base64;
const receipt = require('receipt');
const PDFDocument = require('pdfkit');
const fs = require('fs');
const blobStream = require('blob-stream');
const uuidV4 = require('uuid').v4;
receipt.config.currency = '£';
receipt.config.width = 70;
receipt.config.ruler = '-';

const output = receipt.create([
    {
        type: 'text', value: [
            'MY AWESOME STORE',
            '123 STORE ST',
            'store@store.com',
            'www.store.com'
        ], align: 'center'
    },
    {type: 'empty'},
    {
        type: 'properties', lines: [
            {name: 'Order Number', value: 'XXXXXXXXXXXX'},
            {name: 'Date', value: 'XX/XX/XXXX XX:XX'}
        ]
    },
    {
        type: 'table', lines: [
            {item: 'Product 1', qty: 1, cost: 1000},
            {item: 'Product 2 with a really long name', qty: 1, cost: 17500, discount: {type: 'absolute', value: 1000}},
            {item: 'Another product wth quite a name', qty: 2, cost: 900},
            {item: 'Product 4', qty: 1, cost: 80, discount: {type: 'percentage', value: 0.15}},
            {item: 'This length is ridiculously lengthy', qty: 14, cost: 8516},
            {item: 'Product 6', qty: 3, cost: 500},
            {
                item: 'Product 7',
                qty: 3,
                cost: 500,
                discount: {type: 'absolute', value: 500, message: '3 for the price of 2'}
            }
        ]
    },
    {type: 'empty'},
    {type: 'text', value: 'Some extra information to add to the footer of this docket.', align: 'center'},
    {type: 'empty'},
    {
        type: 'properties', lines: [
            {name: 'GST (10.00%)', value: 'AUD XX.XX'},
            {name: 'Total amount (excl. GST)', value: 'AUD XX.XX'},
            {name: 'Total amount (incl. GST)', value: 'AUD XX.XX'}
        ]
    },
    {type: 'empty'},
    {
        type: 'properties', lines: [
            {name: 'Amount Received', value: 'AUD XX.XX'},
            {name: 'Amount Returned', value: 'AUD XX.XX'}
        ]
    },
    {type: 'empty'},
    {
        type: 'text',
        value: 'Final bits of text at the very base of a docket. This text wraps around as well!',
        align: 'center',
        padding: 5
    }
]);

console.log(output)

// Create a document
const doc = new PDFDocument();
const stream = doc.pipe(blobStream());
// Pipe its output somewhere, like to a file or HTTP response
// See below for browser usage
doc.pipe(fs.createWriteStream(`./receipts/receipt-${uuidV4()}.pdf`));

// Embed a font, set the font size, and render some text
doc.font('Times-Roman')
    .fontSize(16)
    .text(output);
doc.end();
stream.on('finish', function () {
    console.log('sdsd');
    // // get a blob you can do whatever you like with
    // const blob = stream.toBlob('application/pdf');
    //
    // // or get a blob URL for display in the browser
    // const url = stream.toBlobURL('application/pdf');
    // iframe.src = url;
});
// const body = {
//     printerId: '69491380',
//     title: 'test',
//     contentType: 'pdf_uri',
//     content: 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf',
//     source: 'receipt'
// };
// const apiKey = Base64.encode("4JGVBh3zp6iCyFqgdhiRxZ32UM1RDW7og0iTiKhPetI");
// const options = {
//     headers: {
//         "Content-Type": "application/json",
//         "Authorization": `Basic ${apiKey}`
//     }
// };
// axios.post('https://api.printnode.com/printjobs', body, options).then(res => {
//     console.log(res);
// }).catch(err => {
//     console.log(err);
// });
