export interface User {
    id: number;
    email: string;
    password: string;
    deviceId?: string;
}

export class UserModel {
    constructor(private db: any) {}

    async createUser(user: User): Promise<User> {
        const [result] = await this.db.execute(
            'INSERT INTO users (email, password, deviceId) VALUES (?, ?, ?)',
            [user.email, user.password, user.deviceId]
        );
        user.id = result.insertId;
        return user;
    }

    async findUserByEmail(email: string): Promise<User | null> {
        const [rows]: any = await this.db.execute(
            'SELECT * FROM users WHERE email = ?',
            [email]
        );
        return rows[0] || null;
    }
}