import json
import os,sys
#Get all fields
#We only want the first iteration for now. Can be rewritten as the main loop though.
#RODO: Rewrite so that the walk is the main loop
for (root, dirs, files) in os.walk(os.getcwd() + '/json'):
	#print(root)
	#print(dirs)
	fields = dirs
	break
	
for field in fields:
	print('field: ', field)
	path = 'json/{}'.format(field)
	print("path: ", path)
	files = os.listdir(path)
	_list = []
	print('Files:', files)
	for file in files:
		print('File: ',file)
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
				
				li[7] += 1
				for L in range(0,7):
					try:
						li[j] += i[j]['summary']['mean']
					except:
						pass
					
			else:
				li = []
				for j in range(0,7):
					try:
						li.append(i[j]['summary']['mean'])
					except:
						li.append(3)
						#TODO: Make this not garbage code (actually except)
				li.append(1)
				_dict[instructor_course] = li

		for key in _dict:
			li = _dict[key]
			for i in range(7):
				li[i] = li[i]/li[7]
			entry = key
			for i in range(7):
				entry += ',' + str(round(li[i], 2))

			_list.append(entry)
		# pprint(data[0][0]['instructor']['displayName'])

	output = open('CSV/{}.csv'.format(field), 'w')
	print('List length: ', len(_list))
	for i in _list:
		output.write(i)
		output.write('\n')
	output.close()
		



