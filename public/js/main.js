/**
 * jQuery ready function
 */
$(document).ready(function() {
    /**
     * binding on click event of delete user
     */
    $('.deleteUser').on('click', deleteUser);
});

/**
 * delete user logic
 * updates the url post successful delete
 */
function deleteUser() {
    const confirmation = confirm('Are you sure ?');
    if(confirmation) {
        $.ajax({
            type: 'DELETE',
            url: '/users/delete/' + $(this).data('id')
        }).done((response) => {
            window.location.replace('/');
        });
        window.location.replace('/');
    } else {
        return false;
    }
}