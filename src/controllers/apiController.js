const db = require('../database/models');

module.exports = {
    countActiveUsers: async function(req,res){
        let response={data:{}} 
    
        const count = await db.User.count({
          where: { bajaLogica: false }
        });
    
        response.data = {
          totalActiveUsers: count
        }
        return res.json(response);
    
      }
}