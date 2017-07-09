$(function(){
	$('.del').on('click', function(e){
		var target = $(e.target);
		var id = target.data('id');
		var tr = $('.item-id-' + id);
		$.ajax({
			type: 'DELETE',
			url: '/movie/delete?id=' + id
		})
		.done(function(result){
			if(result.success && tr.length > 0){
				tr.remove();
			}
		});
	});
});