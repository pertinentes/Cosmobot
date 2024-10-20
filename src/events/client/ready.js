  module.exports = {
      name: 'ready',
      once: true,
      async execute(client) {
          console.log(`${client.user.tag} est prêt !`);
        
          const config = require('../../../config');
          const owners = Array.isArray(config.owner) ? config.owner : [config.owner];
        
          owners.forEach(ownerId => {
              client.db.set(`owners_${ownerId}`, true);
          });
      }
  };
