import os
from PIL import Image
import pytesseract
from pytesseract import Output
import pymongo

client = pymongo.MongoClient("mongodb+srv://admin:admin@cluster0.oxqrg.mongodb.net/myFirstDatabase?retryWrites=true&w=majority")

db = client["myFirstDatabase"]
col = db["files"]
list = []

dir = "./images/-1095438128"
file_list = os.listdir(dir)
for f in file_list:
  file_name = f
  results = pytesseract.image_to_data(Image.open(dir+"/"+file_name), output_type=Output.DICT, lang="num", config="-psm 5")

  data = []
  for i in range(0, len(results["text"])):
    x = results["left"][i]
    y = results["top"][i]
    w = results["width"][i]
    h = results["height"][i]

    text = results["text"][i]
    conf = int(results["conf"][i])
    if conf > 0:
      data.append({
          "x" : x,
          "y" : y,
          "width" : w,
          "height" : h,
          "rotate" :0,
          "scaleX" : 1,
          "scaleY" : 1,
          "text" :format(text)
      })

  col.find_one_and_update({"filename": file_name}, {'$set':{"ai_data": data, "ai_worked": True}})
#   list.append({
#     "file_name": file_name,
#     "data": data		
#   })


# x = col.insert_many(list)
