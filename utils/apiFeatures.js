const qs = require("qs");

class APIFeatures {
  constructor(query, queryString, aliasParams) {
    this.query = query;
    this.queryString = queryString;
    this.aliasParams = aliasParams;
  }
  //Build Query
  filter() {
    // 1 A}Filltering
    let queryObj;
    if (this.aliasParams) {
      queryObj = { ...this.aliasParams };
    } else {
      queryObj = qs.parse(this.queryString);
    }

    const excludedFields = ["page", "sort", "limit", "fields"];
    excludedFields.forEach((el) => delete queryObj[el]);

    // 1 B}Advance Filltering
    let queryStr = JSON.stringify(queryObj);
    queryStr = queryStr.replace(/\b(gte|gt|lte|lt)\b/g, (match) => `$${match}`);

    // let query = Tour.find(JSON.parse(queryStr));
    this.query.find(JSON.parse(queryStr));

    return this;
  }

  sort() {
  let sortVal = this.aliasParams?.sort || this.queryString.sort;

  if (sortVal) {

    const sortBy = Array.isArray(sortVal)
      ? sortVal.join(' ')
      : sortVal.split(',').join(' ');

    this.query = this.query.sort(sortBy);

  } else {
    this.query = this.query.sort('-createdAt');
  }

  return this;
}

  limitFields() {
    //3} Fields
    const fieldsVal = this.aliasParams?.fields || this.queryString.fields;
    if (fieldsVal) {
      const fields = fieldsVal.split(",").join(" ");
      this.query = this.query.select(fields);
    } else {
      this.query = this.query.select("-__v");
    }
    return this;
  }

  pagination() {
    //3} Pagination
    const limitVal = this.aliasParams?.limit || this.queryString.limit;
    const pageVal = this.aliasParams?.page || this.queryString.page;
    const page = pageVal * 1 || 1;
    const limit = limitVal * 1 || 100;
    const skip = (page - 1) * limit;

    this.query = this.query.skip(skip).limit(limit);

    // if (pageVal) {
    //   const numTours = await Tour.countDocuments();
    //   if (skip >= numTours) throw new error("This page does not exit");
    // }
    return this;
  }
}

module.exports = APIFeatures;