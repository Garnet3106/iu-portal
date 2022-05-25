<?php

error_reporting(E_ALL);
ini_set("display_errors", "1");
header("Access-Control-Allow-Origin: *");

require "vendor/autoload.php";

Dotenv\Dotenv::createImmutable(__DIR__)->load();

class JsonApi {
    public static function respond($json_obj) {
        print(json_encode($json_obj));
        exit();
    }

    public static function respond_error($msg) {
        JsonApi::respond([
            "status" => "error",
            "message" => $msg,
        ]);
    }

    public static function respond_ok() {
        JsonApi::respond([
            "status" => "ok",
        ]);
    }

    public static function respond_assignments($assignments) {
        JsonApi::respond([
            "status" => "ok",
            "assignments" => $assignments,
        ]);
    }
}

class DatabaseTable {
    private $is_logging_in = false;
    private $pdo;

    public function __construct() {}

    public function login() {
        try {
            $dsn = $_ENV["DB_DSN"];
            $usrname = $_ENV["DB_USERNAME"];
            $psw = $_ENV["DB_PASSWORD"];

            $pdo = new PDO($dsn, $usrname, $psw, [
                PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION,
            ]);

            $this->is_logging_in = true;
            $this->pdo = $pdo;
        } catch(PDOException $e) {
            throw $e;
        }
    }

    function execute_query($query, $bind_values = null) {
        try {
            $stmt = $this->pdo->prepare($query);

            if ($bind_values !== null) {
                foreach ($bind_values as $each_bind_key => $each_bind_value) {
                    $stmt->bindValue($each_bind_key, $each_bind_value);
                }
            }

            $succeeded = $stmt->execute();

            if (!$succeeded) {
                JsonApi::respond_error("Failed to execute SQL query.");
            }

            return $stmt;
        } catch(PDOException $e) {
            throw $e;
        }
    }

    public function get_assignment_by_id($id) {
        $stmt = $this->execute_query("SELECT * FROM assignment WHERE id = :id", [
            "id" => $id,
        ]);

        $assignment = $stmt->fetch(PDO::FETCH_ASSOC);

        if (!$assignment) {
            return null;
        }

        return $assignment;
    }

    public function get_all_assignments() {
        try {
            $stmt = $this->execute_query("SELECT * FROM assignment");
            return $stmt->fetchAll(PDO::FETCH_ASSOC);
        } catch(PDOException $e) {
            JsonApi::respond_error("Failed to get assignment data.");
        }
    }

    public function register_assignments($assignment) {
        try {
            $this->execute_query("INSERT INTO assignment (id, registrar_id, registered_at, course_id, lecture_id, assigned_from, submit_to, deadline, description, note) VALUES (UUID(), :registrar_id, NOW(), :course_id, :lecture_id, :assigned_from, :submit_to, :deadline, :description, :note)");
        } catch(PDOException $e) {
            JsonApi::respond_error("Failed to register assignment data.");
        }
    }

    public function register_courses($course) {
        try {
            $this->execute_query("INSERT INTO course (id, registered_at, code, name, election_kind, number_of_credit, year, grade, semester, teacher_ids) VALUES (UUID(), NOW(), :code, :name, :election_kind, :number_of_credit, :year, :grade, :semester, :teacher_ids)");
        } catch(PDOException $e) {
            JsonApi::respond_error("Failed to register course data.");
        }
    }
}

if (!array_key_exists("request", $_GET)) {
    JsonApi::respond_error("Request parameter is not provided.");
}

run(json_decode($_GET["request"], true));

function run($req) {
    if ($req === null) {
        JsonApi::respond_error("Request parameter is not provided.");
    }

    $db_table = new DatabaseTable();

    try {
        $db_table->login();
    } catch(PDOException $e) {
        JsonApi::respond_error("Failed to connect to database server.");
    }

    $action_kind = ensure_property_existence($req, "action");

    switch ($action_kind) {
        case "get_asgn": {
            $assignments = $db_table->get_all_assignments();
            JsonApi::respond_assignments($assignments);
        } break;
        case "reg_asgn": {
            $assignment = ensure_property_existence($req, "assignment");
            $each_assignment["registrar_id"] = ;
            $db_table->register_assignment($assignment);
            JsonApi::respond_ok();
        } break;
        case "reg_course": {
            $courses = ensure_property_existence($req, "courses");
            $db_table->register_courses($courses);
            JsonApi::respond_ok();
        } break;
        default: {
            JsonApi::respond_error("Unknown action kind is provided.");
        } break;
    }
}

function ensure_property_existence($assoc, $key) {
    if (!array_key_exists($key, $assoc)) {
        JsonApi::respond_error("Property `{$key}` is not defined.");
    }

    return $assoc[$key];
}

?>
