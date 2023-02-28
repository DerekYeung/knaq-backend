const Service = require('egg').Service;
class ScanerService extends Service {

  async startScan() {
    const videos = await this.ctx.model.Video.findAll();
    const users = await this.ctx.model.User.findAll();
    console.log(videos.length);
    console.log(users.length);
    for (let i = 0; i < users.length; i++) {
      const user = users[i];
      const tokens = JSON.parse(user.tokens);
      const client = this.ctx.service.google.getClient(tokens);
      const youtube = await this.ctx.service.google.getYoutube(client);
      await this.scanActivity(youtube, user, videos);
      await this.scanSubscriptions(youtube, user);
    }
  }

  async scanSubscriptions(youtube, user) {
    const subscriptions = await youtube.subscriptions.list({
      part: 'id, snippet',
      mine: true,
    });
    const datas = subscriptions.data.items.map(node => {
      return {
        userid: user.id,
        type: 'subscribe',
        target: node.snippet.resourceId.channelId,
        score: 100,
      };
    });
    const model = this.ctx.model.Activity;
    await model.bulkCreate(datas, {
      ignoreDuplicates: true,
      // updateOnDuplicate: [ 'userid', 'type', 'target' ],
    });

    console.log(subscriptions.data.items);

    console.log('subscriptions', datas);
  }

  async scanActivity(youtube, user, videos = []) {
    for (let i = 0; i < videos.length; i++) {
      const video = videos[i];
      await this.scanRate(youtube, user, video);
    }
  }

  async scanRate(youtube, user, video) {
    const response = await youtube.videos.getRating({
      id: video.sn,
    });
    const data = response.data || [];
    const model = this.ctx.model.Activity;
    const isLiked = data && data.items.length > 0 && data.items[0].rating === 'like';
    if (isLiked) {
      const datas = [{
        userid: user.id,
        type: 'like',
        target: video.sn,
        score: 1,
      }];
      await model.bulkCreate(datas, {
        ignoreDuplicates: true,
        // updateOnDuplicate: [ 'userid', 'type', 'target' ],
      });
    }

  }

}

module.exports = ScanerService;
