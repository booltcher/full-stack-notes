## 实战：MongoDB

```yaml
version: '3.1'
services:
 mongo:
  image: mongo
  ports:
   - 27017:27017
			
 mongo-express:
  image: mongo-express
  restart: always
  ports:
   - 8081:8081
```



