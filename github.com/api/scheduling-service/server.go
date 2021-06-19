package main

type SchedulingServer struct {
	schRepo *SchedulingRepository
}

func NewSchedulingServer() (*SchedulingServer, error) {
	schRepo, err := New()
	if err != nil {
		return nil, err
	}

	return &SchedulingServer{
		schRepo: schRepo,
	}, nil
}

func (server *SchedulingServer) CloseDB() error {
	return server.schRepo.Close()
}

func (server *SchedulingServer) CheckVisiblityHandler() {
	server.schRepo.CheckVisiblity()
}
