const SkillService = require("../service/skillService");
const SkillRepository = require("../repositories/skillRepository");

async function createInstance() {
  const skillRepository = new SkillRepository();
  const skillService = new SkillService({ repository: skillRepository });
  return skillService;
}

module.exports = { createInstance };
