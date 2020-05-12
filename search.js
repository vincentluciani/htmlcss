function searchDisplayer(jsonObject,detailsFromURL,resultsDivId,filtersDivId,headerDivId){
	
	this.jsonObject = jsonObject;
	this.resultsDivId = resultsDivId;
	this.filtersDivId = filtersDivId;
	this.detailsFromURL=detailsFromURL;
	var privateDetailsFromURL = detailsFromURL;
		
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
		var filterBody="<div class='category-label' onClick='unHideCategory();'>Category<div id='arrow' class='caret down arrow-down'></div></div><div id='category-wrapper'>";
		var numberOfSelectedSubcategories=0;
		
		for ( var i=0; i<this.jsonObject.details.aggregations.category.buckets.length;i++)
		{
			filterBody+="<div class='category'>"+this.jsonObject.details.aggregations.category.buckets[i].key+"</div>";
			
			if ( null != this.jsonObject.details.aggregations.category.buckets[i].subCategory 
				&& null!= this.jsonObject.details.aggregations.category.buckets[i].subCategory.buckets
				&& this.jsonObject.details.aggregations.category.buckets[i].subCategory.buckets.length > 0)
				{
					/* filterBody+=""; */
					for ( var j=0; j < this.jsonObject.details.aggregations.category.buckets[i].subCategory.buckets.length;j++)
					{
						var link = this.detailsFromURL.baseForFilters+"&category="+this.jsonObject.details.aggregations.category.buckets[i].key+"&subCategory="+this.jsonObject.details.aggregations.category.buckets[i].subCategory.buckets[j].key;
						filterBody+="<a href='"+link+"'><div class='subcategory'>"+this.jsonObject.details.aggregations.category.buckets[i].subCategory.buckets[j].key +" ("+this.jsonObject.details.aggregations.category.buckets[i].subCategory.buckets[j].doc_count+")</div></a>";
						numberOfSelectedSubcategories++;
					}
					/*filterBody+=";*/
				}
		}
		var resettedLink = this.detailsFromURL.baseForFilters;
		
		if ( detailsFromURL.category != null && detailsFromURL.category != "" && detailsFromURL.subCategory != null && detailsFromURL.subCategory != "" )
		{
			filterBody+="<br><a href='"+resettedLink+"'><div class='category'>< All Categories</div></a></div>";
		}
		else
		{
			filterBody+="</div>";
		}
		document.getElementById(filtersDivId).innerHTML = filterBody;


	}
	
	this.readHeaderInformation= function()
	{
		var numberOfHits = this.jsonObject.details.totalHits;
		var termSearched = this.detailsFromURL.termSearched;
		var offset = this.detailsFromURL.offSetNumber;
		var pageSize = this.detailsFromURL.pageSizeNumber;
		
		var firstResultNumber = (offset + 1).toString();
		var lastResultNumber= (offset + pageSize).toString();
	
		if ( offset >= pageSize )
		{
			document.getElementById("previous-button").addEventListener("click", previousPage);
			document.getElementById("previous-button").style.display = "flex";
		} 
		
		if ( (offset+pageSize) <  parseInt(numberOfHits,10) )
		{
		  	document.getElementById("next-button").addEventListener("click", nextPage);
			document.getElementById("next-button").style.display = "flex";
		} else {
			lastResultNumber= numberOfHits;
		}
		
		var informationText = "Showing results "+firstResultNumber+"-"+lastResultNumber+" from "+numberOfHits+ " results for <span class='highlight-term-searched'>"+termSearched+"</span>";
		
		document.getElementById(headerDivId).innerHTML = informationText;
	}
	
	var nextPage = function()
	{
		navigateToPage("next");
	}
	
	var previousPage = function()
	{
		navigateToPage("previous");
	}
	
	
	var navigateToPage = function(direction)
	{

			var urlBase = privateDetailsFromURL.baseForFilters;
			
			if ( privateDetailsFromURL.category != "" && privateDetailsFromURL.category != null )
			{
				urlBase+= "&category=" + privateDetailsFromURL.category;
			}
			if ( privateDetailsFromURL.subCategory != "" && privateDetailsFromURL.subCategory != null )
			{
				urlBase+= "&subCategory=" + privateDetailsFromURL.subCategory;
			}
			
			var newOffset = "";
			
			if ( direction == "next" )
			newOffset = privateDetailsFromURL.offSetNumber + privateDetailsFromURL.pageSizeNumber;
			
			if (direction == "previous" )
			newOffset =  privateDetailsFromURL.offSetNumber - privateDetailsFromURL.pageSizeNumber;
						
						
			urlBase+="&offset="+newOffset +"&pageSize="+privateDetailsFromURL.pageSize;

			window.location.href = urlBase;	
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
	
	this.getDetailsFromURL = function(){
		
		var pageSizeNumber = 6;
		var pageSize="6";
	
		if ( null != this.pageSize )
		{
		  pageSizeNumber = parseInt(this.pageSize, 10);
		  pageSize = parseInt(this.pageSize);
		}
	
		var offsetNumber = 0;
		var offset=0;
		if ( null != this.offset )
		{
		  offsetNumber = parseInt(this.offset, 10);
		  offset = this.offset;
		}
	
		var detailsFromURL = {
			"baseForFilters": "searchresults.html?term="+this.term,
			"termSearched":this.term,
			"offset":offset,
			"offSetNumber":offsetNumber,
			"pageSize":pageSize,
			"pageSizeNumber":pageSizeNumber,
			"category":this.category,
			"subCategory":this.subCategory
		};
		return detailsFromURL;
		
	}
	
}