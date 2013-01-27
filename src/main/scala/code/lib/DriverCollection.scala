package code.lib

import com.mongodb.casbah.Imports._

class DriverCollection(mongoDb: MongoDB) {
    var drivers = mongoDb("drivers")

    def numDriversInYear(year: Int): Int = {
        var total = drivers.count(MongoDBObject("_id" -> MongoDBObject("$regex" -> (year + ".*"))))
        total.asInstanceOf[Int]
    }

    def numOutOfStateDriversInYear(year: Int): Int = {
        var q = ("state" $ne "NJ") ++ MongoDBObject("_id" -> MongoDBObject("$regex" -> (year + ".*")))
        var count = drivers.count(q)
        count.asInstanceOf[Int]
    }

    def numMaleDriversInYear(year: Int): Int = {
        var q = MongoDBObject("sex" -> "M", "_id" -> MongoDBObject("$regex" -> (year + ".*")))
        var count = drivers.count(q)
        count.asInstanceOf[Int]
    }

    def driverAgeIntervalInYear(lower_age: Int, upper_age: Int, year: Int): Int = {
        var q = MongoDBObject("_id" -> MongoDBObject("$regex" -> (year + ".*")),
                              "year" -> MongoDBObject("$lte" -> (2012 - lower_age),
                                                      "$gte" -> (2012 - upper_age)))
        var count = drivers.count(q)
        count.asInstanceOf[Int]
    }
}

