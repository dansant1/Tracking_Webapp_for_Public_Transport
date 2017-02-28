Template.registerHelper('$selected',function( currentValue, optionValue ){
  return ( currentValue == optionValue) ? "selected" : "";
});


Template.registerHelper('$lastIndex',function( obj, currentIndex ){
  console.log( obj );
  console.log( currentIndex );
  return ;
});
