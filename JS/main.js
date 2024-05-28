const { app, BrowserWindow, ipcMain } = require('electron');
const path = require('path');
const { createDatabase, addTask, getTasks, deleteTask, updateTask } = require('./database');

function createWindow() {
    const win = new BrowserWindow({
        width: 800,
        height: 600,
        webPreferences: {
            preload: path.join(__dirname, 'preload.js'),
            contextIsolation: true,
            nodeIntegration: false,
        },
    });

    win.loadFile('index.html');
    win.webContents.openDevTools();
}

app.whenReady().then(() => {
    createDatabase();
    createWindow();

    app.on('activate', () => {
        if (BrowserWindow.getAllWindows().length === 0) createWindow();
    });
});

app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') {
        app.quit();
    }
});

// IPC Event Handlers
ipcMain.handle('add-task', async (event, task) => {
    await addTask(task);
    const tasks = await getTasks();
    return tasks;
});

ipcMain.handle('get-tasks', async () => {
    const tasks = await getTasks();
    return tasks;
});

ipcMain.handle('delete-task', async (event, id) => {
    await deleteTask(id);
    const tasks = await getTasks();
    return tasks;
});

ipcMain.handle('update-task', async (event, id, description) => {
    await updateTask(id, description);
    const tasks = await getTasks();
    return tasks;
});
