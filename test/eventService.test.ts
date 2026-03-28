import { Event } from "../src/api/v1/models/eventModel";
import * as eventService from "../src/api/v1/services/eventService";
import * as firestoreRepository from "../src/api/v1/repositories/firestoreRepository";

jest.mock("../src/api/v1/repositories/firestoreRepository");

describe("Event Service", () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    it("should create an event successfully", async (): Promise<void> => {
        const mockEventData: Partial<Event> = {
            name: "Tech Conference",
            capacity: 100,
            registrationCount: 0,
            status: "active",
            category: "general",
        };
        (firestoreRepository.getDocuments as jest.Mock).mockResolvedValue({
            size: 0,
            docs: [],
        });
        (firestoreRepository.createDocument as jest.Mock).mockResolvedValue(
            "evt_000001"
        );

        const result: string = await eventService.createEvent(mockEventData);

        expect(firestoreRepository.createDocument).toHaveBeenCalled();
        expect(result).toBe("evt_000001");
    });

    it("should return all events successfully", async (): Promise<void> => {
        const mockDocs: {
            id: string;
            data: () => Record<string, unknown>;
        }[] = [
            {
                id: "evt_000001",
                data: (): Record<string, unknown> => ({
                    name: "Tech Conference",
                    date: { toDate: (): Date => new Date("2026-12-25") },
                    capacity: 100,
                    registrationCount: 0,
                    status: "active",
                    category: "general",
                    createdAt: { toDate: (): Date => new Date() },
                    updatedAt: { toDate: (): Date => new Date() },
                }),
            },
        ];
        (firestoreRepository.getDocuments as jest.Mock).mockResolvedValue({
            docs: mockDocs,
        });

        const result: Event[] = await eventService.getAllEvents();

        expect(firestoreRepository.getDocuments).toHaveBeenCalled();
        expect(result).toHaveLength(1);
        expect(result[0].id).toBe("evt_000001");
    });

    it("should return event by id successfully", async (): Promise<void> => {
        const mockDoc: {
            id: string;
            data: () => Record<string, unknown>;
        } = {
            id: "evt_000001",
            data: (): Record<string, unknown> => ({
                name: "Tech Conference",
                date: { toDate: (): Date => new Date("2026-12-25") },
                capacity: 100,
                registrationCount: 0,
                status: "active",
                category: "general",
                createdAt: { toDate: (): Date => new Date() },
                updatedAt: { toDate: (): Date => new Date() },
            }),
        };
        (firestoreRepository.getDocumentById as jest.Mock).mockResolvedValue(
            mockDoc
        );

        const result: Event | null = await eventService.getEventById("evt_000001");

        expect(firestoreRepository.getDocumentById).toHaveBeenCalledWith(
            "events",
            "evt_000001"
        );
        expect(result?.id).toBe("evt_000001");
    });

    it("should update an event successfully", async (): Promise<void> => {
        const mockUpdateData: Partial<Event> = { name: "Updated Conference" };
        (firestoreRepository.updateDocument as jest.Mock).mockResolvedValue(
            undefined
        );

        await eventService.updateEvent("evt_000001", mockUpdateData);

        expect(firestoreRepository.updateDocument).toHaveBeenCalledWith(
            "events",
            "evt_000001",
            mockUpdateData
        );
    });

    it("should delete an event successfully", async (): Promise<void> => {
        (firestoreRepository.deleteDocument as jest.Mock).mockResolvedValue(
            undefined
        );

        await eventService.deleteEvent("evt_000001");

        expect(firestoreRepository.deleteDocument).toHaveBeenCalledWith(
            "events",
            "evt_000001"
        );
    });
});