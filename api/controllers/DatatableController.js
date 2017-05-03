module.exports = {
    initData: function (req, res) {
        User.count()
            .then(function (result) {
                if (result === 0) {
                    var query = '';
                    for (var i = 1; i <= 60; i++) {
                        query += 'INSERT INTO "user" (name, company) VALUES (\'User ' + i + '\', \'Company ' + i + '\');';
                    }

                    return new Promise(function (resolve, reject) {
                        User.query(query, [],
                            function (err, rawResult) {
                                if (err) {
                                    return reject(err);
                                }

                                return resolve(rawResult);
                            });
                    });
                }
            })
            .then(function () {
                return User.find();
            })
            .then(function (users) {
                return res.send('Demo data has been created. Total: ' + users.length + ' records');
            })
            .catch(function (ex) {
                return res.send('Error: ' + ex.message);
            });

    },

    tableData: function (req, res) {
        var input = {
            model: sails.models[req.params.model],
            options: req.allParams(),
        };

        //noinspection JSCheckFunctionSignatures
        sails.helpers.datatable(input)
            .exec({
                success: function (resData) {
                    res.send(resData);
                },
                error: function (err) {
                    res.serverError(err);
                }
            });
    }
};