import os
import sys
import socket
import webbrowser
import subprocess
import platform
import threading
import time
import mimetypes
from pathlib import Path
from http.server import HTTPServer, SimpleHTTPRequestHandler

class Colors:
    RED = '\033[31m'
    GREEN = '\033[32m'
    YELLOW = '\033[33m'
    BLUE = '\033[34m'
    MAGENTA = '\033[35m'
    CYAN = '\033[36m'
    RESET = '\033[0m'

def print_status(message, color=Colors.CYAN):
    print(f"{color}{message}{Colors.RESET}")

def print_error(error, details, solution):
    print(f"{Colors.RED}==================================")
    print(f"ERROR: {error}")
    print(f"Details: {details}")
    print(f"=================================={Colors.RESET}\n")
    print(f"{Colors.CYAN}Possible solution: {solution}{Colors.RESET}\n")
    input("Press Enter to exit...")
    sys.exit(1)

def get_local_ip():
    """Get the local IP address of the machine"""
    try:
        s = socket.socket(socket.AF_INET, socket.SOCK_DGRAM)
        s.connect(('8.8.8.8', 80))
        ip = s.getsockname()[0]
        s.close()
        return ip
    except Exception as e:
        print_status(f"Could not get local IP: {e}", Colors.YELLOW)
        return 'localhost'

def is_port_available(port):
    """Check if the specified port is available"""
    try:
        with socket.socket(socket.AF_INET, socket.SOCK_STREAM) as s:
            s.bind(('localhost', port))
            return True
    except socket.error:
        return False

def find_available_port(start_port=3000, max_attempts=10):
    """Find an available port starting from start_port"""
    port = start_port
    for _ in range(max_attempts):
        if is_port_available(port):
            return port
        port += 1
    return None

def load_config():
    """Load configuration from config file if it exists"""
    config_path = Path(__file__).parent / 'server_config.json'
    if config_path.exists():
        try:
            with open(config_path, 'r') as f:
                import json
                return json.load(f)
        except:
            pass
    return {'port': 3000, 'auto_open_browser': True}

def save_config(config):
    """Save configuration to file"""
    config_path = Path(__file__).parent / 'server_config.json'
    try:
        with open(config_path, 'w') as f:
            import json
            json.dump(config, f, indent=4)
    except:
        pass

class CustomHTTPRequestHandler(SimpleHTTPRequestHandler):
    """Custom handler with proper MIME type support"""
    
    def do_GET(self):
        """Serve a GET request."""
        print_status(f"GET request for: {self.path}", Colors.YELLOW)
        
        # Add common MIME types
        self.extensions_map.update({
            '.css': 'text/css',
            '.js': 'application/javascript',
            '.html': 'text/html',
            '.png': 'image/png',
            '.jpg': 'image/jpeg',
            '.jpeg': 'image/jpeg',
            '.gif': 'image/gif',
            '.svg': 'image/svg+xml',
            '.ico': 'image/x-icon',
            '.json': 'application/json',
            '.woff': 'font/woff',
            '.woff2': 'font/woff2',
            '.ttf': 'font/ttf',
            '.eot': 'application/vnd.ms-fontobject',
            '': 'application/octet-stream',
        })
        
        try:
            # Check if file exists
            file_path = Path(self.translate_path(self.path))
            if not file_path.exists():
                print_status(f"File not found: {file_path}", Colors.RED)
                self.send_error(404, f"File not found: {self.path}")
                return
                
            super().do_GET()
            print_status(f"Successfully served: {self.path} ({self.guess_type(self.path)})", Colors.GREEN)
        except Exception as e:
            print_status(f"Error serving {self.path}: {e}", Colors.RED)
            self.send_error(500, f"Internal server error: {str(e)}")
    
    def guess_type(self, path):
        """Guess the type of a file."""
        base, ext = os.path.splitext(path)
        if ext in self.extensions_map:
            return self.extensions_map[ext]
        ext = ext.lower()
        if ext in self.extensions_map:
            return self.extensions_map[ext]
        return self.extensions_map['']

    def end_headers(self):
        # Enable CORS
        self.send_header('Access-Control-Allow-Origin', '*')
        super().end_headers()

def main():
    print_status("="*60, Colors.CYAN)
    print_status("🌐 LOCAL WEB SERVER", Colors.CYAN)
    print_status("="*60, Colors.CYAN)
    
    try:
        # Load configuration
        config = load_config()
        port = config.get('port', 3000)
        
        # Find available port
        port = find_available_port(port)
        if port is None:
            print_error("Port Error", "No available port found", 
                       "Close applications using ports 3000-3010 or change the port number")
        
        # Get server address
        local_ip = get_local_ip()
        
        # Check if src directory exists
        src_dir = Path(__file__).parent / 'src'
        if not src_dir.exists():
            print_error("Directory Error", 
                    f"'src' directory not found at {src_dir}", 
                    "Create a 'src' directory and place your website files there")
        
        # Change to src directory
        try:
            os.chdir(src_dir)
        except OSError as e:
            print_error("Directory Error", f"Could not change to src directory: {e}", 
                    "Ensure the 'src' directory exists and is accessible")
        
        print_status(f"\nLocal server will start on port {port}", Colors.CYAN)
        print_status(f"Serving files from: {src_dir.absolute()}", Colors.CYAN)
        
        # Check for CSS file
        print_status("Checking file accessibility...", Colors.YELLOW)
        css_path = src_dir / 'css' / 'styles.css'
        if not css_path.exists():
            print_error("CSS Error", 
                    f"styles.css not found at {css_path}", 
                    "Make sure styles.css exists in the css directory")
            
        print_status(f"✅ Found CSS file: {css_path}", Colors.GREEN)
        
        # Create and start server
        server = HTTPServer(('0.0.0.0', port), CustomHTTPRequestHandler)
        
        # Display URLs
        print_status(f"\n" + "="*60, Colors.GREEN)
        print_status("🌐 YOUR WEBSITE IS LIVE!", Colors.GREEN)
        print_status("="*60, Colors.GREEN)
        
        print_status(f"\n📱 LOCAL ACCESS:", Colors.CYAN)
        print_status(f"   http://localhost:{port}", Colors.CYAN)
        
        print_status(f"\n📶 WiFi/LAN ACCESS:", Colors.BLUE)
        print_status(f"   http://{local_ip}:{port}", Colors.BLUE)
        print_status(f"   (Other devices in your WiFi can use this)", Colors.BLUE)
        
        print_status(f"\n📁 Available files:", Colors.YELLOW)
        for file in src_dir.glob('*.html'):
            print_status(f"   • {file.name}", Colors.YELLOW)
        
        print_status(f"\n⚠️  Press Ctrl+C to stop server\n", Colors.YELLOW)
        
        # Open browser
        if config.get('auto_open_browser', True):
            print_status("🌐 Opening browser...", Colors.GREEN)
            webbrowser.open(f'http://localhost:{port}')
        
        # Serve forever
        server.serve_forever()
        
    except KeyboardInterrupt:
        print_status("\n\n🛑 Stopping server...", Colors.YELLOW)
        print_status("✅ Local server stopped", Colors.GREEN)
        print_status("👋 Goodbye!", Colors.CYAN)
        sys.exit(0)
    except Exception as e:
        print_status("\n❌ Error aufgetreten:", Colors.RED)
        print_status(f"Details: {str(e)}", Colors.RED)
        print_status("\nMögliche Lösung:", Colors.CYAN)
        print_status(f"1. Prüfen Sie, ob Port {port} verfügbar ist", Colors.CYAN)
        print_status("2. Stellen Sie sicher, dass alle Dateien zugänglich sind", Colors.CYAN)
        print_status("3. Überprüfen Sie Ihre Internetverbindung", Colors.CYAN)
        input("\nDrücken Sie Enter zum Beenden...")
        sys.exit(1)

if __name__ == "__main__":
    main()