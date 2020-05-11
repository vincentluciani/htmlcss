function APICaller(parameters,callback){
	
	this.parameters = parameters;
	this.callback = callback;
	
	this.executeCall = function(url,urlBaseForFilters)
	{
		var xhttp = new XMLHttpRequest();
		xhttp.onreadystatechange = function()
		{
			if (this.readyState == 4 && this.status == 200)
			{
				callback(JSON.parse(this.responseText),urlBaseForFilters);
			}
		};
		xhttp.open(parameters.method, url, true);
		xhttp.send();
	};
	
	
	this.executeFakeCall = function()
	{
			var fakeAnswer = {
				"items": [
				{
				"id": "https___www_vincent_luciani_com_sitemap_xml_109",
				"category": "PHP",
				"subCategory": "Deal with files",
				"question": "Delete a file",
				"answer": "unlink($filepath)",
				"highlight": {
				"question": [
				"Delete <em>a</em> <em>file</em>"
				]
				}
				},
				{
				"id": "https___www_vincent_luciani_com_sitemap_xml_99",
				"category": "PHP",
				"subCategory": "Deal with files",
				"question": "Close a file",
				"answer": "close($filepointer);",
				"highlight": {
				"question": [
				"Close <em>a</em> <em>file</em>"
				]
				}
				},
				{
				"id": "https___www_vincent_luciani_com_sitemap_xml_97",
				"category": "PHP",
				"subCategory": "Deal with files",
				"question": "when opening, symbol add content at the end, create file if not existing",
				"answer": "a+",
				"highlight": {
				"question": [
				"when opening, symbol add content at the end, <em>create</em> <em>file</em> if not existing"
				],
				"answer": [
				"<em>a</em>+"
				]
				}
				},
				{
				"id": "https___www_vincent_luciani_com_sitemap_xml_98",
				"category": "PHP",
				"subCategory": "Deal with files",
				"question": "Write in a file",
				"answer": "int fwrite($filepointer,$inputstring,strlen($inputstring)); you get $filepointer from fopen",
				"highlight": {
				"question": [
				"Write in <em>a</em> <em>file</em>"
				]
				}
				},
				{
				"id": "https___www_vincent_luciani_com_sitemap_xml_106",
				"category": "PHP",
				"subCategory": "Deal with files",
				"question": "Read a line from a csv file with tab separator",
				"answer": "fgetcsv($filepointer,100,\"\\t\");",
				"highlight": {
				"question": [
				"Read <em>a</em> line from <em>a</em> csv <em>file</em> with tab separator"
				]
				}
				},
				{
				"id": "https___www_vincent_luciani_com_sitemap_xml_163",
				"category": "PHP",
				"subCategory": "Deal with strings",
				"question": "Regular expression: any lower case letter or dash",
				"answer": "[a-z\\-]",
				"highlight": {
				"answer": [
				"[<em>a</em>-z\\-]"
				]
				}
				}
				],
				"details": {
				"totalHits": 128,
				"aggregations": {
				"category": {
				"doc_count_error_upper_bound": 0,
				"sum_other_doc_count": 0,
				"buckets": [
				{
				"key": "PHP",
				"doc_count": 128,
				"subCategory": {
				"doc_count_error_upper_bound": 0,
				"sum_other_doc_count": 0,
				"buckets": [
				{
				"key": "Deal with strings",
				"doc_count": 44
				},
				{
				"key": "Deal with arrays",
				"doc_count": 24
				},
				{
				"key": "Deal with files",
				"doc_count": 16
				},
				{
				"key": "Logic",
				"doc_count": 16
				},
				{
				"key": "Functions and objects",
				"doc_count": 12
				},
				{
				"key": "PHP and SQL",
				"doc_count": 8
				},
				{
				"key": "Information about the request",
				"doc_count": 6
				},
				{
				"key": "Error handling",
				"doc_count": 2
				}
				]
				}
				}
				]
				}
				}
				}
				}
					
			this.callback(fakeAnswer);					
	}
}
