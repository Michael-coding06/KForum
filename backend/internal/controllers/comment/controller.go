package comment

import "github.com/go-redis/redis/v8"

type Controller struct {
	RedisCLient *redis.Client
}

func NewController(rdb *redis.Client) *Controller {
	return &Controller{
		RedisCLient: rdb,
	}
}
