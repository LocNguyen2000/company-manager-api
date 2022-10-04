import logger from '../config/logger.mjs';

export const addLog = async (req, res, next) => {
  try {
    const {level, message} = req.body;

    let data = await logger.write(level, message, req.ip, res.username)

    return res.status(200).json({data})
    
  } catch (error) {
    next(error);
  }
};

export const updateLog = async (req, res, next) => {
  try {
    const id = req.params,
      upData = req.body;
    let returnedData = await logger.updateData(upData, {
      _id: id,
    });

    return res.status(200).json({ data: returnedData });
  } catch (error) {
    next(error);
  }
};

export const getLog = async (req, res, next) => {
  try {
    const queryFilters = req.query,
      { startAt, endAt } = req.query;
    let objSearch = {};

    if (startAt || endAt) {
      objSearch['createdAt'] = {};

      if (startAt) {
        delete queryFilters.startAt;
        startAt = new Date(startAt).toISOString();
        objSearch['createdAt']['$gte'] = startAt;
      }

      if (endAt) {
        delete queryFilters.endAt;
        endAt = new Date(endAt).toISOString();
        objSearch['createdAt']['$lt'] = endAt;
      }
    }

    let data = await logger.findData(queryFilters);
    return res.status(200).json({ data });
  } catch (error) {
    next(error);
  }
};
