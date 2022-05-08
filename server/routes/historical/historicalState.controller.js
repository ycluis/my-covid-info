const asyncHandler = require("express-async-handler");
const Query = require("../../query/Query");
const query = new Query();
const redisConn = require("../../config/redisClient");

const getHistoricalStateData = asyncHandler(async (req, res) => {
  const { page, pageSize } = req.query;
  const { stateName } = req.params;

  if (!page || !pageSize || !stateName) {
    res.status(401);
    throw Error("Invalid params");
  }

  const limit = pageSize;
  const offset =
    page === null || pageSize === null ? null : (page - 1) * pageSize;

  const totalItems = await query.getTotalItemCount("state_active", {
    stateName,
  });

  const data = await query.getHistoricalStateActiveCase({
    stateName,
    limit,
    offset,
  });

  res.status(200).json({
    success: true,
    pages: {
      pageSize,
      pageNumber: page,
      totalItems: totalItems[0].count,
      totalPage: Math.ceil(totalItems[0].count / pageSize),
    },
    data,
  });
});

module.exports = getHistoricalStateData;