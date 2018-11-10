# from urllib.request import urlopen
# from bs4 import BeautifulSoup as soup
import json
import os,sys

# my_url = '/Users/parsabagheri/Desktop/422.json'
# client = urlopen(my_url)
# page_html = client.read()
# client.close()
# client = open(my_url)
# page_html = client.read()

# page_soup = soup(page_html, "html.parser")
# print(page_soup.tr)

fields = ['CIS']

for field in fields:
	path = './{}'.format(fields[0])
	files = os.listdir(path)

	_list = ['FIELD,COURSE NUMBER,INSTRUCTOR FIRSTNAME,INSTRUCTOR LASTNAME,COURSE TITLE,Q6,Q7,Q2,Q1']
	for file in files:
		my_url = '{}/{}'.format(path, file)
		with open(my_url) as f:
		    data = json.load(f)

		# li = [data[0][0]['instructor']['displayName'], data[0][0]['course']['name'], data[0][5]['summary']['mean'], data[0][6]['summary']['mean'], data[0][1]['summary']['mean'], data[0][0]['summary']['mean']]
		# print(data[0][0]['course']['name'])

		_class = file.split('.')
		_dict = {}
		for i in data:
			instructor_course = field + ',' + _class[0] + ',' + i[0]['instructor']['firstName'] + ',' + i[0]['instructor']['lastName'] + ',' + i[0]['course']['name']
			if instructor_course in _dict.keys():
				li = _dict[instructor_course]
				li[4] += 1
				li[0] += i[5]['summary']['mean']
				li[1] += i[6]['summary']['mean']
				li[2] += i[1]['summary']['mean']
				li[3] += i[0]['summary']['mean']

			else:
				li = []
				li.append(i[5]['summary']['mean'])
				li.append(i[6]['summary']['mean'])
				li.append(i[1]['summary']['mean'])
				li.append(i[0]['summary']['mean'])
				li.append(1)
				_dict[instructor_course] = li

		
		for key in _dict:
			li = _dict[key]
			for i in range(4):
				li[i] = li[i]/li[4]
			entry = key
			for i in range(4):
				entry += ',' + str(round(li[i], 2))

			_list.append(entry)
		# pprint(data[0][0]['instructor']['displayName'])

	output = open('{}.csv'.format(field), 'w')
	for i in _list:
		output.write(i)
		output.write('\n')



