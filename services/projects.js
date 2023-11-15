let data = [
    {
      id: 1,
      name: 'sparky',
      type: 'dog',
      tags: ['sweet'],
    },
    {
      id: 2,
      name: 'buzz',
      type: 'cat',
      tags: ['purrfect'],
    },
    {
      id: 3,
      name: 'max',
      type: 'dog',
      tags: [],
    },
  ];


module.exports.Projects = class {
    constructor() {
      this.id = 4;
    }
    findAll({ type, limit }) {
      return data //.filter(d => d.type === type).slice(0, limit);
    }

}