from selenium import webdriver

from selenium.webdriver.common.keys import Keys
from selenium.webdriver.support.ui import Select
from selenium.webdriver.support import expected_conditions as EC
from selenium.webdriver.support.ui import WebDriverWait as wait

import os
from time import sleep

#STEP 0:
#You need a secrets.py file, it looks like this:
#id = "951xxxxxx" (This is your duckweb login information)
#pa = "PASSWORD"
#
import secrets
#STEP 1:
#SETUP, NAVIGATE TO COURSE EVAL PAGE
#
driver = webdriver.Chrome()
#driver.implicitly_wait(5)
driver.get('https://duckweb.uoregon.edu/pls/prod/twbkwbis.P_WWWLogin')
assert "User" in driver.title
print(driver.title)

#Main Menu - Hard coded right now
	#Keep track of first window
window_1 = driver.window_handles[0]
	#Send credentials and click to next page
driver.find_element_by_id('UserID').send_keys(secrets.id)
driver.find_element_by_name('PIN').send_keys(secrets.pa)
	#(TODO: Make this not rely on xpath)
driver.find_element_by_xpath('/html/body/div[5]/form/p/input[1]').click()

#2nd menu, click to the "bridge" menu
driver.find_element_by_name('SWB CourseEval title').click()
#Bridge menu
driver.find_element_by_xpath('/html/body/div[5]/p[1]/a').click()
#A popup appears:
window2 = driver.window_handles[1]
driver.switch_to_window(window2)
driver.maximize_window()
#sleep(1)
#Click the dropdown "Reports" it is the second of its kind.
dropdown_toggles = driver.find_elements_by_class_name('dropdown-toggle')
print(len(dropdown_toggles))
for element in dropdown_toggles:
	try:
		element.click()
		print("clicked succesfully")
		break
	except:
		print("dropdown_toggle #{} not interactable".format(dropdown_toggles.index(element)))
#Click magnifying glass area (courses)
driver.find_element_by_css_selector("a[ng-href='coursesearch']").click()
#Switch to iframe
wait(driver, 10).until(EC.frame_to_be_available_and_switch_to_it("contentFrame"))
#Get list of selectors (1st is subject, 2nd is course)
selectors = driver.find_elements_by_tag_name('select')

#Select subjects selector
selectors[0].click()
subject_selector = Select(selectors[0])
subjects = subject_selector.options

#STEP 2:
#Setup and populate Data structures for URL creation later, create/fill subjects.txt
#TODO: '/' character not currently supported by the school, so I'm not supporting it. If the school fixes their side of things and un-breaks course/subjects with a '/', I'll add support for that
#IMPORTANT: You need an empty folder in the working directory named 'json' for this to work
sc_dict = {}
for i in range(13,len(subjects)):
	#Click subject
	subject_selector.select_by_index(str(i))
	#S is a single selection webelement
	s = subjects[i]
	key = s.text
	if '/' in key:
		continue
	path = os.getcwd() + '/json/' + key
	#Create DIR for current subject
	if not os.path.exists(path):
		os.mkdir(path)
	#Get course names for the subject
	#Click the course selector/ grab it's options
	selectors[1].click()
	course_selector = Select(selectors[1])
	c_options = course_selector.options
	#Create dict entry list out of option elements
	entry = []
	for opt in c_options[1:]:
		if '/' in opt.text:
			continue
		entry.append(opt.text)
	#create dict entry Subject -> List of courses
	sc_dict[key] = entry
	print(key, ': ', sc_dict[key])
	#Write subject name to file for processing loop (this actually might be useless)
	#file = open('subjects.txt', 'w')
	#file.write(text + '\n')

#STEP 3:
#GET INFO FROM URLS, ADD TO DIRS AS JSON
#
for key, courses in sc_dict.items():
	#URL up to the subject (key)
	url = 'https://www.applyweb.com/eval/new/searchCourse/byCourse/' + key.replace(" ", "%20") + "/"
	for c in courses:
		c_url = url + c
		print(c_url)
		try:
			driver.get(c_url)
			output_json = open('json/' + key + '/' + c + '.json', 'w')
			output_json.write(driver.find_element_by_tag_name('body').text)
			output_json.close()
		except:
			continue
	

	
sleep(10)
driver.quit()