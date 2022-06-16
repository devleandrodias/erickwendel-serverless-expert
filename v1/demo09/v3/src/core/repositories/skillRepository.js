const BaseRepository = require("./baseRepository");
const skillSchema = require("./schemas/skillSchema");

class SkillRepository extends BaseRepository {
  constructor() {
    super({ schema: skillSchema });
  }
}

module.exports = SkillRepository;
