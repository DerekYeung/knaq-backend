const Service = require('egg').Service;
class ScanerService extends Service {

  async startScan() {
    const videos = await this.ctx.model.Video.findAll();
    const users = await this.ctx.model.User.findAll();
    console.log(videos.length);
    console.log(users.length);
    for (let i = 0; i < users.length; i++) {
      const user = users[i];
      await this.scanActivity(user, videos);
    }
  }

  async scanActivity(user, videos = []) {
    const tokens = JSON.parse(user.tokens);
    const client = this.ctx.service.google.getClient(tokens);
    const youtube = await this.ctx.service.google.getYoutube(client);
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
      }];
      await model.bulkCreate(datas, {
        updateOnDuplicate: [ 'userid', 'type', 'target' ],
      });
    }

  }

}

module.exports = ScanerService;
