// advanced results takes in a model and any populate associated with that model
const advancedResults = (model, populate) =>   async (req, res, next) =>    {
      // console.log(req.query);
      let query;
    
      // copy req.query
      const reqQuery = { ...req.query }
  
      // Fields to exclude
      const removeFields = ["select", "sort", "limit", "page"];
  
      // Loop over removeFields & delete them from req query
      removeFields.forEach(param => delete reqQuery[param])
      
      // Create query string
      let queryStr = JSON.stringify(reqQuery);
      
      // when querying with > or < add a $ before the match in the query string
      queryStr = queryStr.replace(/\b(gt|gte|lt|lte|in)\b/g, match => `$${match}`)
      
      // Finding resource 
      query = model.find(JSON.parse(queryStr));
  
      // If using select, only selected fields ?select=_____,____ will be returned
      if(req.query.select)    {
          const fields = req.query.select.split(",").join(" ")
          query = query.select(fields)
      }
  
      // Sort
      if(req.query.sort)  {
          const sortBy = req.query.sort.split(",").join(" ");
          query = query.sort(sortBy)
      }   else {
          query = query.sort("-createdAt")
      }
  
      // Pagination 
      const page = parseInt(req.query.page, 10) || 1;
      const limit = parseInt(req.query.limit, 10) || 25;
      const startIndex = (page - 1) * limit;
      const endIndex = page * limit;
      // countDocuments, mongoose method to camp all documents
      const total = await model.countDocuments()
  
      query = query.skip(startIndex).limit(limit);
      
      // if called on to populate will populate with whatever parameters are given to the populate function
      if(populate) {
          query = query.populate(populate);
      }
      // Executing query 
      const results = await query;
      
      // Pagination result
      const pagination = {}
      if(endIndex < total) {
          pagination.next = {
              page: page + 1,
              limit
          }
      }
  
      if (startIndex > 0) {
          pagination.prev = {
              page: page -1,
              limit
          }
      }
      // responds with logging the appropriate results of running the middleware for a model
      res.advancedResults = {
          success: true,
          count: results.length,
          pagination,
          data: results
      }

      next();
}

module.exports = advancedResults