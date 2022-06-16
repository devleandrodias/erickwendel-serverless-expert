const HeroService = require("../service/heroService");
const HeroRepository = require("../repositories/heroRepository");

async function createInstance() {
  const heroRepository = new HeroRepository();
  const heroService = new HeroService({ repository: heroRepository });
  return heroService;
}

module.exports = { createInstance };
