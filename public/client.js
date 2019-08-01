$("document").ready(function() {
  var items = [];
  var itemsRaw = [];

  let regex = /,/g;
  $.getJSON('/api/books', function(data) {
    itemsRaw = data;

$.each(data, function(i,val){
   let commentList= val.comments.map((v,i,a)=>{
      return "<li class='bookReview'>"+v+"</li>";
      })
   // console.log(commentList.join(""));
   return $('#biblioteque').append(`<div class='bookItem' > <h3 class='title' style='background:${getRandomColor()}'>${val.title}</h3><ol class='listOfComment'>${commentList.join("")}</ol><br/><form class='commentForm'id="`+`form${val._id}`+`"><input type='text' name='comment' id="`+`input${val._id}`+`" placeholder='comment..' value='' class='commentInput'/><button class='addComment' id=${val._id}><i class="fa fa-arrow-right"></i></button></form><button class='deleteBook' id=${val._id}>Delete 📔</button></div>`);
})

    // console.log(itemsRaw);
  });
  
 // var comments = [];

  
$("#biblioteque").on('click','button.deleteBook',function(){
    let deletedLink = `/api/books/${this.id}`;
  console.log(this.id,deletedLink);
    $.ajax({
    url:deletedLink,
    method:'DELETE',
    // async: false,
    success: function (data){
    location.reload();
      $('#vafli').html("<h1>"+data+" was selected</h1>");
      console.log(data);
    }
    })
  })
  
$("#biblioteque").on('click','button.addComment',function(){
let bookIdToAddComments = this.id;
let newComment=$('#input'+bookIdToAddComments).val();
let formValue = $('#form'+bookIdToAddComments).serialize();
let linkToModify = `/api/books/${bookIdToAddComments}`
$.ajax({
url:linkToModify,
method:'POST',
dataType:'json',
data:formValue,
success:function(data){
  location.reload();
}
  
})

})

  
  $('#newBook').click(function() {
    $.ajax({
      url: '/api/books',
      type: 'post',
      dataType: 'json',
      data: $('#newBookForm').serialize(),
      success: function(data) {
        //update list
      }
    });
  });
  
  $('#deleteAllBooks').click(function() {
    $.ajax({
      url: '/api/books',
      type: 'delete',
      dataType: 'json',
      // data: $('#newBookForm').serialize(),
      success: function(data) {
      location.reload();
       $('#deleteAllBooks span').text('RefreshPage')
      }
    });
  }); 
// function getRandomColor(){
//  let letters = '123456789ABDEF';
//  let color = '#';
//   for(let i=0;i<6;i++){
//     color+= letters[Math.floor(Math.random()*14)];
//   }
//   return color;
// }
  
function getRandomColor(){
let randomRGB1 = Math.floor(Math.random()*255);
let randomRGB2 = Math.floor(Math.random()*255); 
let randomRGB3 = Math.floor(Math.random()*255);
  return `rgba(${randomRGB1}, ${randomRGB2}, ${randomRGB3}, 0.3)`;
}
});