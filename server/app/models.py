# from . import db
# from datetime import datetime
# import pytz

# IST = pytz.timezone('Asia/Kolkata')

# def get_ist_time():
#     return datetime.now(IST)

# class Blog(db.Model):
#     __tablename__ = 'blogs'
#     id = db.Column(db.Integer, primary_key=True)
#     title = db.Column(db.String(255), nullable=False)
#     body = db.Column(db.Text, nullable=False)
#     image_filename = db.Column(db.String(255))
#     created_date = db.Column(db.DateTime, default=get_ist_time)
#     update_date = db.Column(db.DateTime, default=get_ist_time, onupdate=get_ist_time)

#     def __repr__(self):
#         return f'<Blog {self.title}>'
