const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');
const jsforce = require('jsforce');

const app = express();

const htmlPath = path.resolve(__dirname + '/app.html');

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.use(express.static('public'));

const salesforceCredentials = {
    clientId: '3MVG9ux34Ig8G5epi6.OFQ9xGeDNJhVPT8S9lRQLjjTzYCtk4eeBJ1Jkr67KtqwT1HeQ4i3XO8S3Ww_l.4cG_',
    clientSecret: '7CDB00F5D5AB99A550DC589441D83D66AB872B88E53BF86886098DEBF194683F',
    username: 'hjhwang@s3c.com',
    password: 'Ckdqnr34#$5Sw3MdmSiGE2uDK8XG5y8P4mj',
    securityToken: ''
};

const salesforceBaseUrl = 'https://s3cdev-dev-ed.lightning.force.com';

var conn = new jsforce.Connection({
    oauth2 : {
        clientId : salesforceCredentials.clientId
        , clientSecret : salesforceCredentials.clientSecret
        , redirectUri : 'https://s3cdev-dev-ed.my.salesforce.com/services/authcallback/SalesforceAcredentials'
    }
});

// console.log('hello', conn);




// Call the Salesforce API
async function callSalesforceApi() {
    try {
        const accessToken = await authenticate();
        const response = await axios.post(`${salesforceBaseUrl}/services/apexrest/executeBatch/`, {
            postData: {
                interfaceId: `Bearer ${accessToken}`,
            },
        });

        console.log('Account details:', response.data);
    } catch (error) {
        console.error('Error calling Salesforce API:', error.response ? error.response.data : error.message);
    }
}


app.get('/', function (req, res) {
    // console.log('connect /');
    // res.send('Hello world !!');
    res.sendFile(htmlPath);
});

app.post('/submit', async (req, res) => {
    console.log(req.body);

    conn.login(salesforceCredentials.username, salesforceCredentials.password, function(err, userInfo) {
        console.log('salesforce Username' , salesforceCredentials.username);
        console.log('salesforce password' , salesforceCredentials.password);
    
        if (err) { return console.error(err); }

        // Now you can get the access token and instance URL information.
        // Save them to establish connection next time.
        console.log(conn.accessToken);
        console.log(conn.instanceUrl);
        // logged in user property
        console.log("User ID: " + userInfo.id);
        console.log("Org ID: " + userInfo.organizationId);

        const body = { interfaceId: 'IF_001' };

        conn.apex.post(`/services/apexrest/executeBatch`, body, function(err, res) {
            if (err) { return console.error(err); }
            console.log("response: ", res);
        })

        // conn.request(
        //     {
        //         method: 'POST',
        //         url: `${salesforceBaseUrl}/services/apexrest/executeBatch`,
        //         body: { interfaceId: 'IF_001' },
        //         headers: {
        //             'Content-Type': 'application/json'
        //           }
        //     },
        //     function(err, response) {
        //         if (err) { 
        //           return console.error('Error calling executeBatch method:', err); 
        //         }
          
        //         console.log('Response from executeBatch method:', response);
        //     }
        // );
        
    });

    
    // Perform any processing you need here (e.g., saving to a database)

    
});

app.listen(3000, function () {
    console.log('3000 port listen!!');
})