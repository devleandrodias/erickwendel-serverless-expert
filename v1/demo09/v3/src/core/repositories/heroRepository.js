const BaseRepository = require("./baseRepository");
const heroSchema = require("./schemas/heroSchema");

class HeroRepository extends BaseRepository {
  constructor() {
    super({ schema: heroSchema });
  }
}

module.exports = HeroRepository;
