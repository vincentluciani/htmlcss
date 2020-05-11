function searchDisplayer(jsonObject,urlBase,resultsDivId,filtersDivId){
	
	this.jsonObject = jsonObject;
	this.resultsDivId = resultsDivId;
	this.filtersDivId = filtersDivId;
	this.urlBase=urlBase;
		
		
	this.readResultsBody = function()
	{
		var bodyHTML="<table><tbody>";
		
		for ( var i=0; i<jsonObject.items.length;i++)
		{
			var question=""
			
			if ( null != jsonObject.items[i].highlight && null != jsonObject.items[i].highlight.question && jsonObject.items[i].highlight.question !="" )
			{
					question = jsonObject.items[i].highlight.question;
			} else {
					question = jsonObject.items[i].question;
			}
			
			if ( null != jsonObject.items[i].highlight && null != jsonObject.items[i].highlight.answer && jsonObject.items[i].highlight.answer !="" )
			{
					answer = jsonObject.items[i].highlight.answer;
			} else {
					answer = jsonObject.items[i].answer;
			}
			
			bodyHTML+="<tr><td>"+question+"</td><td>"+answer+"</td></tr>";
		}
		
		bodyHTML+="</tbody></table>";
		document.getElementById(resultsDivId).innerHTML = bodyHTML;
		
	}
	
	
	this.readFilters = function()
	{
		var filterBody="<ul><div class='category-label'>Category</div>";
		
		for ( var i=0; i<this.jsonObject.details.aggregations.category.buckets.length;i++)
		{
			filterBody+="<li><span>"+this.jsonObject.details.aggregations.category.buckets[i].key+"</span></li>";
			
			if ( null != this.jsonObject.details.aggregations.category.buckets[i].subCategory 
				&& null!= this.jsonObject.details.aggregations.category.buckets[i].subCategory.buckets
				&& this.jsonObject.details.aggregations.category.buckets[i].subCategory.buckets.length > 0)
				{
					filterBody+="<ul>";
					for ( var j=0; j < this.jsonObject.details.aggregations.category.buckets[i].subCategory.buckets.length;j++)
					{
						var link = this.urlBase+"&category="+this.jsonObject.details.aggregations.category.buckets[i].key+"&subCategory="+this.jsonObject.details.aggregations.category.buckets[i].subCategory.buckets[j].key;
						filterBody+="<li><span><a href='"+link+"'>"+this.jsonObject.details.aggregations.category.buckets[i].subCategory.buckets[j].key +" ("+this.jsonObject.details.aggregations.category.buckets[i].subCategory.buckets[j].doc_count+")</a></span></li>";
					}
					filterBody+="</ul>";
				}
		}
		
		filterBody+="</ul>";
		document.getElementById(filtersDivId).innerHTML = filterBody;


	}
	
	this.readHeaderInformation= function()
	{
		
	}
	
}


function searchLauncher(){
	
	
	this.readURLPostFix = function()
	{
		var urlPostFix="";
		var queryString = window.location.search;
		var urlParams = new URLSearchParams(queryString);
		
		this.term = urlParams.get('term');
		
		if ( null != this.term && this.term !="" )
			urlPostFix+=this.term;
		
		this.category = urlParams.get('category');
		
		if ( null != this.category && this.category !="" )
			urlPostFix+="&category="+this.category;
		
		this.subCategory = urlParams.get('subCategory');
		
		if ( null != this.subCategory && this.subCategory !="" )
			urlPostFix+="&subCategory="+this.subCategory;
				
		this.offset = urlParams.get('offset');
		
		if ( null != this.offset && this.offset !="" )
			urlPostFix+="&offset="+this.offset;
		
		this.pageSize = urlParams.get('pageSize');
		
		if ( null != this.pageSize && this.pageSize !="" )
			urlPostFix+="&pageSize="+this.pageSize;
		
		console.log("url searched:"+urlPostFix);
		return urlPostFix;
		
	}
	
	this.getURLBaseForFilters = function(){
		
		var urlBase = "searchresults.html?term="+this.term;
		return urlBase;
		
	}
	
}