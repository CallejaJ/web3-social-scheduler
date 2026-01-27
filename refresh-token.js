const axios = require('axios');
require('dotenv').config();

const URL = 'https://api.lens.xyz/graphql';

const REFRESH_MUTATION = `
  mutation Refresh($refreshToken: String!) {
    refresh(request: { refreshToken: $refreshToken }) {
      ... on AuthenticationTokens {
        accessToken
        refreshToken
      }
      ... on ForbiddenError {
        reason
      }
    }
  }
`;

// Latest Refresh Token from Step 570
const REFRESH_TOKEN = "eyJ0eXAiOiJKV1QiLCJhbGciOiJSUzI1NiJ9.eyJpc3MiOiJodHRwczovL2FwaS5sZW5zLnh5eiIsImlhdCI6MTc2OTUyNDA4MywiZXhwIjoxNzcwMTI4ODgzLCJzaWQiOiI3MmNhMjIyYi1kNGEwLTQ1MDgtYmJlYy0xNzNlZTA4YzNlY2YifQ.qHacXjRVie2BLkk6Qbj5JbTrVxxPCAM1EMus2qSRWzjq4hjRShxk7vF5IEaSaiXPsIZSXiV6tBwETcmf-Uatvm85veoqQGyJSZfp2_riKCaaLNmvigdlfIx5Fqss-nLXBIbu_8gPWorHlLDmBRR9awm5lj3lPkLW_JPUO1b5H8h62M0m7QL2zV4PUUcp6XBUs0w0O7AkKw9UisvW6hTRfrvWAARO-6oC5daTy9SLDLppmyy2G6iFbKPwt445wkV_Q7yREJaijBd2eoeaLmHibshUg3e6hdxaJ0iTk_-_MQ_LgOBTGCcJ3YvFDrkmKMIgUQ50Hn7zCnsBnmQXU65h6g";

async function refreshToken() {
  console.log('Refreshing Token...');

  try {
    const response = await axios.post(
      URL,
      { 
        query: REFRESH_MUTATION, 
        variables: { refreshToken: REFRESH_TOKEN } 
      },
      {
        headers: {
            'Content-Type': 'application/json',
            'User-Agent': 'MementoBot/1.0'
        }
      }
    );
    
    if (response.data.errors) {
        console.error('Errors:', JSON.stringify(response.data.errors));
    } else {
        const data = response.data.data.refresh;
        console.log('NEW ACCESS TOKEN:', data.accessToken);
        console.log('NEW REFRESH TOKEN:', data.refreshToken);
    }

  } catch (error) {
    console.error('Error:', error.message);
    if(error.response) {
       console.log('Body:', JSON.stringify(error.response.data));
    }
  }
}

refreshToken();
