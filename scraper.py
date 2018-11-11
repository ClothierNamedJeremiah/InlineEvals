# from urllib.request import urlopen
# from bs4 import BeautifulSoup as soup
import json
import os,sys
import numpy as np
import matplotlib.pyplot as plt

# my_url = '/Users/parsabagheri/Desktop/422.json'
# client = urlopen(my_url)
# page_html = client.read()
# client.close()
# client = open(my_url)
# page_html = client.read()

# page_soup = soup(page_html, "html.parser")
# print(page_soup.tr)

def plot(inst, rating, field, _class):
	'''
	plots the data of a class and saves the graph in a .png file
	'''
	group_len = len(inst)
	fig, ax = plt.subplots()
	index = np.arange(group_len)
	bar_width = 0.1
	opacity = 0.8

	Q7 = plt.bar(index, rating[0], bar_width,
				 alpha=opacity,
				 color='r',
				 label='Clearity')
	Q6 = plt.bar(index + bar_width, rating[1], bar_width,
				 alpha=opacity,
				 color='g',
				 label='Amount Learnt')
	Q2 = plt.bar(index + 2 * bar_width, rating[2], bar_width,
				 alpha=opacity,
				 color='b',
				 label='Instructor Rating')
	Q1 = plt.bar(index + 3 * bar_width, rating[3], bar_width,
				 alpha=opacity,
				 color='y',
				 label='Course Quality')

	plt.ylabel('rating')
	plt.xticks(index + 3*bar_width/2, inst)

	# print(_class)
	# print(inst)
	
	plt.legend()
	
	plt.tight_layout()
	plt.savefig('./{}_plots/{}.png'.format(field, _class), bbox_inches='tight', format='png', dpi=100)
	plt.close()

fields = ['CIS']

for field in fields:
	path = './{}'.format(fields[0])
	files = os.listdir(path)

	_list = []
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
	output.close()

	
	class_code = _list[0].split(',')[1]
	i = 0
	if not os.path.exists('{}_plots'.format(field)):
		os.makedirs('{}_plots'.format(field))
	while(i<len(_list)):
		graph_list = []

		while(i < len(_list) and _list[i].split(',')[1] == class_code):
			graph_list.append(_list[i])
			i += 1
		
		inst = []
		for j in graph_list:
			inst.append(j.split(',')[3])

		rating = []
		Q7 = []
		Q6 = []
		Q2 = []
		Q1 = []
		for j in graph_list:
			q = j.split(',')
			Q7.append(float(q[5]))
			Q6.append(float(q[6]))
			Q2.append(float(q[7]))
			Q1.append(float(q[8]))

		rating.append(Q7)
		rating.append(Q6)
		rating.append(Q2)
		rating.append(Q1)
		plot(inst, rating, graph_list[0].split(',')[0], graph_list[0].split(',')[1])
		# print(graph_list)
		if(i < len(_list)):
			class_code = _list[i][4:7]
		



