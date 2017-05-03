var _ = require('lodash');

module.exports = {

    friendlyName: 'Datatable',

    description: 'This helper will try to parse the request params from datatable, generate the Waterline query arcordingly then return the query result as the datatable response structure.',

    inputs: {
        model: {
            type: 'ref',
            description: 'Model object.',
            required: true
        },
        options: {
            type: 'ref',
            description: 'Datatable request params.',
            required: true
        },
    },

    exits: {},

    fn: function (inputs, exits) {
        var model      = inputs.model;
        var options    = inputs.options;
        var attributes = model.attributes;

        if (!model) {
            exits.error({error: 'Model doesn\'t exist'});
        }

        //default column options
        var _columns = [
            {
                data: '',
                name: '',
                searchable: false,
                orderable: false,
                search: {
                    regex: false,
                    value: ''
                }
            }
        ];

        //default datatable options
        var _options = {
            draw: 0,
            columns: _columns,
            start: 0,
            length: 10,
            search: {
                value: '',
                regex: false
            },
            order: [
                {
                    column: 0,
                    dir: 'asc'
                }
            ]
        };

        //merge both Object, options and _options into _options
        _.assign(_options, options);

        //response format
        var _response = {
            draw: _options.draw,
            recordsTotal: 0,
            recordsFiltered: 0,
            iTotalRecords: 0,//legacy
            iTotalDisplayRecords: 0,//legacy
            data: []
        };

        //build where criteria
        var where      = [];
        var whereQuery = {};
        var select     = [];

        if (_.isArray(_options.columns)) {
            _options.columns.forEach(function (column, index) {

                // This handles the column search property
                if (_.isNull(column.data) || !column.searchable) {
                    return true;
                }

                var columnDefined = attributes[column.data];
                var columnName    = column.data.split('.')[0];

                select.push(columnName);

                if (column.data === 'id') {
                    return true;
                }

                if (_.isPlainObject(column.search.value) &&
                    column.search.value.from !== '' &&
                    column.search.value.to !== '') {

                    whereQuery[column.data] = {
                        '>=': column.search.value.from,
                        '<': column.search.value.to
                    };
                }
                else if (_.isString(column.search.value)) {
                    if (!_.isEqual(column.search.value, '')) {
                        whereQuery[columnName] = column.search.value;
                    }
                }
                else if (_.isNumber(column.search.value) && columnDefined.type === 'number') {
                    whereQuery[columnName] = column.search.value;
                }

                if (columnDefined.type !== 'number') {

                    // This handles the global search function of this column
                    var filter   = {};
                    var operator = null;

                    switch (columnDefined.type) {
                        case 'string':
                            operator = 'contains';
                            break;
                        /*case 'number':
                         operator = 'in';
                         break;*/
                    }

                    if (operator) {
                        var colFilter       = {};
                        colFilter[operator] = _options.search.value;
                        filter[columnName]  = colFilter;

                        where.push(filter);
                    }

                }

            });
        }

        if (where.length > 0) {
            whereQuery['or'] = where;
        }

        var sortColumn = [];
        _.forEach(_options.order, function (value, key) {
            var sortBy = _options.columns[value.column].data;
            if (_.includes(sortBy, '.')) {
                sortBy = sortBy.substr(0, sortBy.indexOf('.'));
            }

            var sortCriterial     = {};
            sortCriterial[sortBy] = value.dir.toUpperCase();
            sortColumn.push(sortCriterial);
        });

        //find the database on the query and total items in the database data[0] and data[1] repectively
        return Promise.all(
            [
                model.find({
                    where: whereQuery,
                    skip: +_options.start,
                    limit: +_options.length,
                    sort: sortColumn
                }).populateAll(),
                model.count(),
                model.count({where: whereQuery})
            ])
            .then(function (data) {
                _response.recordsTotal  = data[1];
                _response.iTotalRecords = data[1];

                _response.recordsFiltered      = data[2];
                _response.iTotalDisplayRecords = data[2];

                _response.data = data[0];

                return exits.success(_response);
            })
            .catch(function (error) {
                return exits.error(error);
            });
    }

};
