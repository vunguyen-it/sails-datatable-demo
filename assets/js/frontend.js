/**
 * Created by vunguyen on 4/27/17.
 */

$(function () {
    console.log('frontend.js');

    $('#tb_demo').DataTable({
        processing: true,
        serverSide: true,
        lengthMenu: [10, 25, 50, 75, 100],
        ajax: {
            url: '/datatable/user',
            cache: false
        },
        columnDefs: [
            {name: 'id', targets: 0},
            {name: 'name', targets: 1},
            {name: 'company', targets: 2}
        ],
        columns: [
            {data: 'id'},
            {data: 'name'},
            {data: 'company'}
        ]
    });
});