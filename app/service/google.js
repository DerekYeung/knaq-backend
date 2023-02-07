const Service = require('egg').Service;
const {
  google,
} = require('googleapis');
const OAuth2 = google.auth.OAuth2;
const client = {
  client_id: '138432311361-is78d2q6cmtuprcqr44fdb6v6c6q4kbf.apps.googleusercontent.com',
  project_id: 'knaq-369818',
  auth_uri: 'https://accounts.google.com/o/oauth2/auth',
  token_uri: 'https://oauth2.googleapis.com/token',
  auth_provider_x509_cert_url: 'https://www.googleapis.com/oauth2/v1/certs',
  redirect_uris: [ 'https://staging.knaqapp.com/connect' ],
  javascript_origins: [ 'https://staging.knaqapp.com' ],
};
const SCOPES = [ 'https://www.googleapis.com/auth/youtube' ];
class MailService extends Service {
  constructor(app) {
    super(app);
    this.client = {
      ...client,
      client_secret: this.app.config.GOOGLE_CLIENT_KEY,
    };
    const clientSecret = this.client.client_secret;
    const clientId = this.client.client_id;
    const redirectUrl = this.client.redirect_uris[0];
    const oauth2Client = new OAuth2(clientId, clientSecret, redirectUrl);
    this.oauth2Client = oauth2Client;
  }

  requestAuth() {
    const authUrl = this.oauth2Client.generateAuthUrl({
      access_type: 'offline',
      scope: SCOPES,
      include_granted_scopes: true,
    });
    this.ctx.redirect(authUrl);
  }

}

module.exports = MailService;
