const Service = require('egg').Service;
const jwt = require('jsonwebtoken');
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
const SCOPES = [
  'openid profile',
  'https://www.googleapis.com/auth/userinfo.profile',
  'https://www.googleapis.com/auth/userinfo.email',
  'https://www.googleapis.com/auth/youtube',
  'https://www.googleapis.com/auth/youtube.channel-memberships.creator',
  'https://www.googleapis.com/auth/youtube.force-ssl',
  'https://www.googleapis.com/auth/youtube.readonly',
  'https://www.googleapis.com/auth/youtubepartner',
];
class GoogleService extends Service {
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

  async getYoutube(client) {
    const youtube = await google.youtube({
      version: 'v3',
      auth: client,
    });
    return youtube;
  }

  getClient(credentials) {
    const clientSecret = this.client.client_secret;
    const clientId = this.client.client_id;
    const redirectUrl = this.client.redirect_uris[0];
    const oauth2Client = new OAuth2(clientId, clientSecret, redirectUrl);
    oauth2Client.credentials = credentials;
    return oauth2Client;
  }

  requestAuth() {
    const authUrl = this.oauth2Client.generateAuthUrl({
      access_type: 'offline',
      scope: SCOPES,
      include_granted_scopes: true,
    });
    this.ctx.redirect(authUrl);
  }

  async connected() {
    const { code } = this.ctx.request.body || {};
    const response = await this.oauth2Client.getToken(code);
    console.log(response);
    const {
      tokens,
    } = response;
    const { id_token } = tokens;
    const identity = jwt.decode(id_token);
    const { name, email } = identity;
    const exists = await this.ctx.model.User.findOne({
      where: {
        name: identity.name,
      },
    });
    let user = exists;
    if (!user) {
      user = await this.ctx.model.User.create({
        name,
        email,
        tokens: JSON.stringify(tokens),
      });
    } else {
      user.name = name;
      if (tokens.refresh_token) {
        user.tokens = JSON.stringify(tokens);
      }
      await user.save();
    }
    const payload = {
      userid: user.id,
      name,
      email,
    };
    const token = await jwt.sign(payload, 'knaq-jwt-key');
    return {
      ...payload,
      token,
    };
  }

}

module.exports = GoogleService;
